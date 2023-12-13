import { firestore } from './initialize.js';

import { collection, QueryDocumentSnapshot, DocumentData, query, where, limit, getDocs, getDoc, deleteDoc } from '@firebase/firestore';
import { SDK_VERSION } from 'firebase/app';
import { setDoc, addDoc, writeBatch, doc, increment, serverTimestamp, Timestamp } from 'firebase/firestore'; // for adding the Document to Collection

import axios from 'axios';

export async function getData(FilePath) {
    const todosCollection = collection(firestore, FilePath);

    const todosQuery = query(todosCollection); //Get all events for this month

    // get the todos
    const querySnapshot = await getDocs(todosQuery);

    // map through todos adding them to an array
    var result2 = [];
    querySnapshot.forEach((snapshot) => {
        result2.push({
            Email: snapshot._document.data.value.mapValue.fields.Email.stringValue,
            FirstName: snapshot._document.data.value.mapValue.fields.FirstName.stringValue,
            LastName: snapshot._document.data.value.mapValue.fields.LastName?.stringValue || ''
        });
    });

    return result2;
}

export async function sendData(uploadData, FilePath) {
    try {
        //add the Document
        const batch = writeBatch(firestore);

        var EmailData = [];
        uploadData.forEach((element) => {
            let tempBatch = doc(firestore, FilePath, element.OriginalEmail);
            batch.set(tempBatch, element);

            EmailData.push({
                email_address: element.Email,

                status: 'subscribed',
                merge_fields: {
                    FNAME: element.FirstName,
                    LNAME: element.LastName
                }
            });
        });

        await batch.commit();

        const data = {
            members: EmailData,
            update_existing: true
        };
        return data;
    } catch (error) {
        //show an error message
        console.error(error);
        return 'Error';
    }
}

export async function deleteData(FilePath, id) {
    const todosCollection = doc(firestore, FilePath, id);

    // get the todos
    const querySnapshot = await deleteDoc(todosCollection);

    return querySnapshot;
}

export async function CheckIfUserCanAccessTest(TestID, UserID) {
    try {
        var TempUserPK = await getDocs(query(collection(firestore, 'Users'), where('Personal-Details.ID', '==', String(UserID))));

        if (TempUserPK.docs.length <= 0) {
            return false;
        } else {
            if (!TempUserPK.docs[0]._document.data.value.mapValue.fields?.archived?.booleanValue) {
                let UserPK = TempUserPK.docs[0].id;
                let tempTestA = await getDoc(doc(firestore, 'Send-Tests/' + TestID));
                let tempTest = await getDoc(doc(firestore, 'Send-Tests/' + TestID + '/Users', UserPK));
                if (tempTest.exists() == false) {
                    return false;
                } else {
                    var tempResult;
                    let tempTestForTest = (await getDoc(doc(firestore, 'Send-Tests', TestID)))._document.data.value.mapValue.fields;

                    tempResult = {
                        Started: tempTest._document.data.value.mapValue.fields.Started?.booleanValue,
                        QuestionsLeft: tempTest._document.data.value.mapValue.fields['Questions-Left'].stringValue,
                        Attempt: tempTest._document.data.value.mapValue.fields['Attempt'].integerValue,
                        MaxAttempts: tempTestA._document.data.value.mapValue.fields['Maximum-Amount-Of-Attempts'].integerValue,
                        DefaultQuestions: tempTest._document.data.value.mapValue.fields['Default-Questions'].stringValue,
                        TestPKCode: tempTestForTest['Test-Details'].mapValue.fields.Code.stringValue,
                        TestVersion: tempTestForTest['Test-Details'].mapValue.fields.Version.stringValue,
                        UserPK: UserPK
                    };
                    if (new Date() > new Date(tempTestForTest['Expiry-Date'].timestampValue.seconds * 1000)) {
                        return false;
                    } else {
                        return tempResult; //Started-QuestionsLeft-TestPKCode-TestVersion
                    }
                }
            } else {
                return false;
            }
        }
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function SaveShuffledQuestionsForUser(TestID, UserID, ShuffledQuestions) {
    try {
        //add the Document
        const batch = writeBatch(firestore);

        let tempBatch = doc(firestore, 'Send-Tests/' + TestID + '/Users', UserID);

        batch.update(tempBatch, { ['Questions-Left']: ShuffledQuestions, Started: true, ['Total-Marks']: 0 });
        await batch.commit();

        return true;
    } catch (error) {
        //show an error message
        console.error(error);
        return false;
    }
}

export async function GetQuestion(TestPKCode, TestVersion, NextQuestionNumber) {
    try {
        var TempUserPK = (await getDoc(doc(firestore, 'Stored-Tests/' + TestPKCode + '/Versions/' + TestVersion + '/Questions', NextQuestionNumber)))._document.data.value.mapValue.fields;
        return {
            Question: TempUserPK['Question'].stringValue,
            Type: TempUserPK['Type'].stringValue,
            Options: Object.entries(TempUserPK['Options'].arrayValue.values).map((x) => x[1].stringValue),
            CorrectAnswer: TempUserPK['Correct-Answer'].stringValue,
            Active: TempUserPK['Active']?.booleanValue
        };
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function SaveUsersAnswer(TestID, UserID, QuestionNumber, Attempt, UserAnswer, IsUserCorrect) {
    try {
        //add the Document
        const batch = writeBatch(firestore);

        let tempBatch = doc(firestore, 'Send-Tests/' + TestID + '/Users/' + UserID + '/Attempt' + Attempt, 'Question' + QuestionNumber);

        batch.set(tempBatch, { ['Answer']: UserAnswer, Correct: IsUserCorrect });
        if (IsUserCorrect == true) {
            //Update users total marks
            tempBatch = doc(firestore, 'Send-Tests/' + TestID + '/Users', UserID);
            batch.update(tempBatch, { ['Total-Marks']: increment(1) });
        }

        await batch.commit();

        return true;
    } catch (error) {
        //show an error message
        console.error(error);
        return false;
    }
}

export async function dbGetUsersTotalMarks(TestPKCode, UsersID) {

    try {
        var TempUserPK = (await getDoc(doc(firestore, 'Send-Tests/' + TestPKCode + '/Users', UsersID)))._document.data.value.mapValue.fields;

        //Top-Total-Marks
        if (TempUserPK['Total-Marks'].integerValue > Number(TempUserPK['Top-Total-Marks'].stringValue)) {
            const batch = writeBatch(firestore);
            let tempBatch = doc(firestore, 'Send-Tests/' + TestPKCode + '/Users', UsersID);
            batch.update(tempBatch, { ['Top-Total-Marks']: TempUserPK['Total-Marks'].integerValue });
            await batch.commit();
        }

        return {
            TotalMarks: TempUserPK['Total-Marks'].integerValue,
            Questions: TempUserPK['Default-Questions'].stringValue
        };
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function dbUpdateUserQuestionsRemaining(TestID, UserID, QuestionsLeft) {
    try {
        //add the Document
        const batch = writeBatch(firestore);

        let tempBatch = doc(firestore, 'Send-Tests/' + TestID + '/Users', UserID);
        batch.update(tempBatch, { ['Questions-Left']: QuestionsLeft });

        if (QuestionsLeft == 'None') {
            batch.update(tempBatch, { ['Completed']: true, ['Attempt']: increment(1) });
        }

        await batch.commit();

        return true;
    } catch (error) {
        //show an error message
        console.error(error);
        return false;
    }
}

/* 
    **********************************************************************************************************************************************************************************************************************************************************************************************
    ADMIN TASKS
    **********************************************************************************************************************************************************************************************************************************************************************************************
*/

export async function GetAllTestsToDisplay() {
    try {
        var TempUserPK = await getDocs(collection(firestore, 'Stored-Tests'));

        // map through the docs and add into array
        var result2 = [];
        for (const snapshot of TempUserPK.docs) {
            if (!snapshot._document?.data.value.mapValue.fields?.archived?.booleanValue) {
                let TempTestSendOut = await getDoc(doc(firestore, 'Stored-Tests/' + snapshot.id + '/Versions', snapshot._document.data.value.mapValue.fields['Latest-Version'].stringValue));
                result2.push({
                    Name: snapshot._document.data.value.mapValue.fields?.Name?.stringValue || '',
                    CatPK: snapshot._document.data.value.mapValue.fields?.Category?.stringValue,
                    Category: (await getDoc(doc(firestore, 'Categorys/' + snapshot._document.data.value.mapValue.fields?.Category?.stringValue)))?._document?.data.value.mapValue.fields?.Name.stringValue,
                    CreatedBy: snapshot._document.data.value.mapValue.fields['Created-By'].stringValue,
                    CreatedDate: snapshot._document.data.value.mapValue.fields['Created-Date'].timestampValue,
                    LatestVersion: snapshot._document.data.value.mapValue.fields['Latest-Version'].stringValue,
                    TestPK: snapshot.id,
                    TestSendOut: TempTestSendOut._document.data.value.mapValue.fields?.['Sent-Out']?.booleanValue,
                    ActiveQuestions: TempTestSendOut._document.data.value.mapValue.fields['Active-Questions'].stringValue
                });
            }
        }

        return result2;
    } catch (err) {
        console.error(err);
        return false;
    }
}
const getGroupNameFromId = async (id) => {
    try {
        if (id == 'Admin') {
            return 'Admin';
        }
        return (await getDoc(doc(firestore, 'Groups', id)))._document.data.value.mapValue.fields.Name.stringValue;
    } catch (e) {
        return false;
    }
};
export async function GetAllUsersToDisplay() {
    try {
        var TempUserPK = await getDocs(collection(firestore, 'Users'));

        // map through the docs and add into array
        var result2 = [];
        for (const snapshot of TempUserPK.docs) {
            if (!snapshot._document.data.value.mapValue.fields?.archived?.booleanValue) {
                result2.push({
                    FName: snapshot._document.data.value.mapValue.fields['Personal-Details'].mapValue.fields.FName.stringValue,
                    LName: snapshot._document.data.value.mapValue.fields['Personal-Details'].mapValue.fields.LName.stringValue,
                    IDNumber: snapshot._document.data.value.mapValue.fields['Personal-Details'].mapValue.fields.ID.stringValue,
                    Cell: snapshot._document.data.value.mapValue.fields['Contact-Details'].mapValue.fields.Cell.stringValue,
                    Email: snapshot._document.data.value.mapValue.fields['Contact-Details'].mapValue.fields.Email.stringValue,
                    Group: await getGroupNameFromId(snapshot._document.data.value.mapValue.fields.Group.stringValue),
                    GroupPK: snapshot._document.data.value.mapValue.fields.Group.stringValue,
                    UserPK: snapshot.id
                });
            }
        }

        return result2;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function AddNewTest(TestData, ExtraTestDetails) {
    try {
        //add the Document
        const batch = writeBatch(firestore);
        var testPK = await addDoc(collection(firestore, 'Stored-Tests'), {
            Name: ExtraTestDetails.Name,
            Category: ExtraTestDetails.Category,
            ['Created-By']: ExtraTestDetails.CreatedBy,
            ['Created-Date']: serverTimestamp(),
            ['Latest-Version']: '1'
        });

        var QuestionList = '';
        for (let index = 0; index < TestData.length; index++) {
            let tempBatch = doc(firestore, 'Stored-Tests/' + testPK.id + '/Versions/1/Questions', '' + (index + 1));

            batch.set(tempBatch, TestData[index]);

            if (TestData[index].Active == true) {
                QuestionList += index + 1 + ',';
            }
        }

        let tempBatch = doc(firestore, 'Stored-Tests/' + testPK.id + '/Versions', '1');
        batch.set(tempBatch, { ['Created-By']: ExtraTestDetails.CreatedBy, ['Created-Date']: serverTimestamp(), ['Sent-Out']: false, ['Active-Questions']: QuestionList.substring(0, QuestionList.length - 1) });

        /* 

        Add in timestamps and created by and created when, for version 1
        } */

        await batch.commit();

        return true;
    } catch (error) {
        //show an error message
        console.error(error);
        return false;
    }
}

export async function AddNewDBUser(UserDetails) {
    try {
        await addDoc(collection(firestore, 'Users'), UserDetails);

        const batch = writeBatch(firestore);

        let temp = doc(firestore, 'Groups', UserDetails.Group);

        batch.update(temp, { 'Staff-Count': increment(1) });

        await batch.commit();

        return true;
    } catch (error) {
        //show an error message
        console.error(error);
        return false;
    }
}

export async function GetUserSpecificDetails(UserPK) {
    try {
        //Get data from all attempts
        var snapshot = await getDoc(doc(firestore, 'Users', UserPK));

        var result2 = {
            FName: snapshot._document.data.value.mapValue.fields['Personal-Details'].mapValue.fields.FName.stringValue,
            LName: snapshot._document.data.value.mapValue.fields['Personal-Details'].mapValue.fields.LName.stringValue,
            IDNumber: snapshot._document.data.value.mapValue.fields['Personal-Details'].mapValue.fields.ID.stringValue,
            Cell: snapshot._document.data.value.mapValue.fields['Contact-Details'].mapValue.fields.Cell.stringValue,
            Email: snapshot._document.data.value.mapValue.fields['Contact-Details'].mapValue.fields.Email.stringValue,
            Group: snapshot._document.data.value.mapValue.fields.Group.stringValue,
            UserPK: snapshot.id
        };

        return result2;
    } catch (error) {
        //show an error message
        console.error(error);
        return false;
    }
}

export async function EditDBUser(UserDetails, UserPK) {
    try {
        const batch = writeBatch(firestore);

        let tempBatch = doc(firestore, 'Users', UserPK);

        batch.set(tempBatch, UserDetails);

        let tempBatchData = await getDoc(tempBatch);

        if (tempBatchData._document.data.value.mapValue.fields.Group.stringValue != UserDetails.Group) {
            let tempA = doc(firestore, 'Groups', tempBatchData._document.data.value.mapValue.fields.Group.stringValue);

            batch.update(tempA, { 'Staff-Count': increment(-1) });

            let tempB = doc(firestore, 'Groups', UserDetails.Group);

            batch.update(tempB, { 'Staff-Count': increment(1) });
        }

        await batch.commit();

        return true;
    } catch (error) {
        //show an error message
        console.error(error);
        return false;
    }
}

export async function DBSendTestOut(ListOfUsersPK, testDetails, ExpiryDateTime, TestActiveQuestions, MaxAmountOfAttempts) {
    try {
        //add the Document

        const batch = writeBatch(firestore);

        var testPK = await addDoc(collection(firestore, 'Send-Tests'), {
            ['Expiry-Date']: Timestamp.fromDate(new Date(ExpiryDateTime)),

            ['Sent-Date']: serverTimestamp(),

            ['Test-Details']: testDetails,

            ['Maximum-Amount-Of-Attempts']: Number(MaxAmountOfAttempts),

            ['UsersPK']: ListOfUsersPK
        });

        for (let index = 0; index < ListOfUsersPK.length; index++) {
            let tempBatch = doc(firestore, 'Send-Tests/' + testPK.id + '/Users', ListOfUsersPK[index]);

            batch.set(tempBatch, {
                Attempt: 0,

                Completed: false,

                Started: false,

                ['Total-Marks']: 0,

                ['Top-Total-Marks']: 0,

                ['Default-Questions']: TestActiveQuestions,

                ['Questions-Left']: TestActiveQuestions
            });
        }

        let tempBatch = doc(firestore, 'Stored-Tests/' + testDetails.Code + '/Versions', testDetails.Version);

        batch.update(tempBatch, { ['Sent-Out']: true });

        await batch.commit();

        return testPK.id;
    } catch (error) {
        //show an error message

        console.error(error);

        return false;
    }
}

export async function getAllUsersWhoTookSpecificTest(TestDetails) {
    try {
        var TempUserPK = await getDocs(query(collection(firestore, 'Send-Tests'), where('Test-Details.Code', '==', TestDetails.TestPK)));
        // map through the docs and add into array
        var resultMain = [];
        for (const snapshot of TempUserPK.docs) {
            var result2 = [];
            var tempUsersPerTest = await getDocs(collection(firestore, 'Send-Tests/' + snapshot.id + '/Users'));
            for (const snapshotOfUsersPerTest of tempUsersPerTest.docs) {
                var tempUsersDetails = (await getDoc(doc(firestore, 'Users', snapshotOfUsersPerTest.id)))._document.data.value.mapValue.fields;

                //workout and save the following
                let tempPercent = (snapshotOfUsersPerTest._document.data.value.mapValue.fields['Top-Total-Marks'].stringValue / snapshotOfUsersPerTest._document.data.value.mapValue.fields['Default-Questions'].stringValue.split(',').length) * 100;

                if (snapshotOfUsersPerTest._document.data.value.mapValue.fields['Top-Total-Marks'].stringValue == undefined) {
                    tempPercent = 0;
                }
                result2.push({
                    //User details about the test
                    Started: snapshotOfUsersPerTest._document.data.value.mapValue.fields.Started?.booleanValue,
                    Completed: snapshotOfUsersPerTest._document.data.value.mapValue.fields.Completed?.booleanValue,
                    TotalMarks: snapshotOfUsersPerTest._document.data.value.mapValue.fields['Total-Marks'].integerValue,
                    Questions: snapshotOfUsersPerTest._document.data.value.mapValue.fields['Default-Questions'].stringValue,
                    Attempts: snapshotOfUsersPerTest._document.data.value.mapValue.fields.Attempt.integerValue,
                    Percentage: tempPercent,

                    //User personal details
                    FName: tempUsersDetails['Personal-Details'].mapValue.fields.FName.stringValue,
                    LName: tempUsersDetails['Personal-Details'].mapValue.fields.LName.stringValue,
                    IDNumber: tempUsersDetails['Personal-Details'].mapValue.fields.ID.stringValue,
                    Cell: tempUsersDetails['Contact-Details'].mapValue.fields.Cell.stringValue,
                    Email: tempUsersDetails['Contact-Details'].mapValue.fields.Email.stringValue,
                    Group: tempUsersDetails.Group.stringValue,
                    UserPK: snapshotOfUsersPerTest.id
                });
            }

            var tempTestFullDetails = (await getDoc(doc(firestore, 'Stored-Tests', snapshot._document.data.value.mapValue.fields['Test-Details'].mapValue.fields.Code.stringValue)))._document.data.value.mapValue.fields;

            var options = { year: 'numeric', month: 'long', day: 'numeric' };

            let tempTestDetails = {
                ExpiryDate: new Date(snapshot._document.data.value.mapValue.fields['Expiry-Date'].timestampValue.seconds * 1000).toLocaleDateString([], options),
                SentDate: new Date(snapshot._document.data.value.mapValue.fields['Sent-Date'].timestampValue.seconds * 1000).toLocaleDateString([], options),
                Version: snapshot._document.data.value.mapValue.fields['Test-Details'].mapValue.fields.Version.stringValue,
                MaxAttempts: snapshot._document.data.value.mapValue.fields['Maximum-Amount-Of-Attempts'].integerValue,
                TestSentID: snapshot.id,
                CategoryName: await (async function () {
                    let cats = await getCategorys();
                    for (let name of cats) {
                        if (name.value == tempTestFullDetails.Category.stringValue) {
                            return name.label;
                        }
                    }
                })(),
                Category: tempTestFullDetails.Category.stringValue,
                TestName: tempTestFullDetails.Name.stringValue,
                TestPK: snapshot._document.data.value.mapValue.fields['Test-Details'].mapValue.fields.Code.stringValue
            };

            resultMain.push({ Results: result2, TestDetails: tempTestDetails });
        }

        return resultMain;
    } catch (error) {
        //show an error message
        console.error(error);
        return false;
    }
}

export async function GetUserSpecificTestDetails(TestSentID, UserPK) {

    try {
        let continueLoop = true;
        var resultMain = [];
        for (let AttemptCounter = 0; continueLoop; AttemptCounter++) {
            //Get data from all attempts
            var ListOfQuestions = await getDocs(collection(firestore, 'Send-Tests/' + TestSentID + '/Users/' + UserPK, 'Attempt' + AttemptCounter));

            if (!ListOfQuestions?.docs.length) {
                return resultMain;
            }

            var result2 = [];
            for (const QuestionDetails of ListOfQuestions.docs) {
                //Get all questions from attempt

                result2.push({
                    UsersAnswer: QuestionDetails._document.data.value.mapValue.fields.Answer.stringValue,
                    Correct: QuestionDetails._document.data.value.mapValue.fields.Correct?.booleanValue,
                    QuestionNumber: QuestionDetails.id.replace('Question', '')
                });
            }
            resultMain.push(result2);
        }
    } catch (error) {
        //show an error message
        console.error(error);
        return false;
    }
}

export async function GetAllDetailOfTestToEdit(TestDetails) {
    try {
        /* 
            ActiveQuestions: '1,2';
            Category: 'Food';
            CreatedBy: 'PiySOIqpr4CFTU5pKpFT';
            CreatedDate: '2023-07-13T07:43:16.449Z';
            LatestVersion: '1';
            TestPK: 'lrZplU098sRkjUYJZ6Hl';
            TestSendOut: true; 
        */
        var resultMain = [];

        var ListOfQuestions = await getDocs(collection(firestore, 'Stored-Tests/' + TestDetails.TestPK + '/Versions/' + TestDetails.LatestVersion, 'Questions'));
        for (const QuestionDetails of ListOfQuestions.docs) {
            //Get all questions from attempt
            var tempDetails = QuestionDetails._document.data.value.mapValue.fields;

            var tempOptions = [];
            tempDetails.Options.arrayValue.values.forEach((x) => {
                var tempChecked = false;
                if (x.stringValue == tempDetails['Correct-Answer'].stringValue) {
                    tempChecked = true;
                }
                tempOptions.push({
                    value: x.stringValue,
                    label: x.stringValue,
                    checked: tempChecked
                });
            });

            resultMain.push({
                Active: tempDetails.Active?.booleanValue,
                CorrectAnswer: tempDetails['Correct-Answer'].stringValue,
                ManualAnswer: tempDetails['Manual-Answer'].stringValue,
                Options: tempOptions,
                Question: tempDetails.Question.stringValue,
                Type: tempDetails.Type.stringValue,
                QuestionNumber: QuestionDetails.id
            });
        }

        return resultMain;
    } catch (error) {
        //show an error message
        console.error(error);
        return false;
    }
}

export async function EditCurrentTest(TestData, ExtraTestDetails) {
    try {
        //add the Document
        const batch = writeBatch(firestore);

        /* 
            NewVersion: Number(constEditTestDetails) + 1,
                    
            TestPK: constEditTestDetails.TestPK 
        */

        /* var testPK = await addDoc(collection(firestore, 'Stored-Tests'), {
            Category: ExtraTestDetails.Category,
            ['Created-By']: ExtraTestDetails.CreatedBy,
            ['Created-Date']: serverTimestamp(),
            ['Latest-Version']: '1'
        });
 */

        var QuestionList = '';
        for (let index = 0; index < TestData.length; index++) {
            let tempBatch = doc(firestore, 'Stored-Tests/' + ExtraTestDetails.TestPK + '/Versions/' + ExtraTestDetails.NewVersion + '/Questions', '' + (index + 1));

            batch.set(tempBatch, TestData[index]);

            if (TestData[index].Active == true) {
                QuestionList += index + 1 + ',';
            }
        }

        let tempBatch3 = doc(firestore, 'Stored-Tests/' + ExtraTestDetails.TestPK + '/Versions', String(ExtraTestDetails.NewVersion));

        batch.set(tempBatch3, { ['Created-By']: ExtraTestDetails.CreatedBy, ['Created-Date']: serverTimestamp(), ['Sent-Out']: false, ['Active-Questions']: QuestionList.substring(0, QuestionList.length - 1) });

        let tempBatch2 = doc(firestore, 'Stored-Tests', ExtraTestDetails.TestPK);

        batch.update(tempBatch2, { Name: ExtraTestDetails.Name, Category: ExtraTestDetails.Category, ['Latest-Version']: String(ExtraTestDetails.NewVersion) });

        await batch.commit();

        return true;
    } catch (error) {
        //show an error message
        console.error(error);
        return false;
    }
}

export async function getAllGroups() {
    try {
        var TempUserPK = await getDocs(collection(firestore, 'Groups'));
        let res = [];
        for (const snapshot of TempUserPK.docs) {
            if (!snapshot._document.data.value.mapValue.fields?.archived?.booleanValue) {
                res.push({
                    Name: snapshot._document.data.value.mapValue.fields.Name.stringValue,
                    Amount: snapshot._document.data.value.mapValue.fields['Staff-Count'].integerValue,
                    id: snapshot.id
                });
            }
        }
        return res;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function newGroup(Name) {
    try {
        var TempUserPK = await getDocs(collection(firestore, 'Groups'));
        for (const snapshot of TempUserPK.docs) {
            if (snapshot._document.data.value.mapValue.fields.Name.stringValue == Name) {
                return false;
            }
        }
        await addDoc(collection(firestore, 'Groups'), { Name: Name, 'Staff-Count': 0 });
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}
export async function getCategorys() {
    try {
        const res = [];
        const all = await getDocs(collection(firestore, 'Categorys'));
        if (all.docs.length) {
            for (let snapshot of all.docs) {
                if (!snapshot._document.data.value.mapValue.fields?.archived?.booleanValue) {
                    res.push({
                        value: snapshot.id,
                        label: snapshot._document.data.value.mapValue.fields.Name.stringValue
                    });
                }
            }
        }
        return res;
    } catch (e) {
        console.error(e);
    }
}
export async function updateCategory(Name, PK) {
    try {
        const batch = writeBatch(firestore);
        batch.update(doc(firestore, 'Categorys', PK), { Name: Name });
        await batch.commit();
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}
export async function newCategory(Name) {
    try {
        var TempUserPK = await getDocs(collection(firestore, 'Categorys'));
        for (const snapshot of TempUserPK.docs) {
            if (snapshot._document.data.value.mapValue.fields.Name.stringValue == Name) {
                return false;
            }
        }
        await addDoc(collection(firestore, 'Categorys'), { Name: Name });
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function updateGroup(InputData) {
    try {
        let tempTest = await getDoc(doc(firestore, 'Groups', InputData.id));
        if (tempTest.exists() == false) {
            return false;
        }

        const batch = writeBatch(firestore);
        batch.update(doc(firestore, 'Groups', InputData.id), { Name: InputData.Name });
        await batch.commit();

        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function getBasicTestData(TestId) {
    try {
        let tempSendTest = await getDoc(doc(firestore, 'Send-Tests', TestId));
        let ActualTest = await getDoc(doc(firestore, 'Stored-Tests', tempSendTest._document.data.value.mapValue.fields['Test-Details'].mapValue.fields.Code.stringValue));
        return {
            Attempts: tempSendTest._document.data.value.mapValue.fields['Maximum-Amount-Of-Attempts'].integerValue,
            Name: ActualTest._document.data.value.mapValue.fields.Name.stringValue,
            Exp: tempSendTest._document.data.value.mapValue.fields['Expiry-Date'].timestampValue
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getBasicTestDataFromPK(TestId) {
    try {
        let ActualTest = await getDoc(doc(firestore, 'Stored-Tests', TestId));
        return {
            Name: ActualTest._document.data.value.mapValue.fields.Name.stringValue
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}

/*note! not complete */

export async function getTestsNamesTakenByUser(userPK) {
    try {
        var TempUserPK = await getDocs(collection(firestore, 'Send-Tests'));

        var resultMain = [];

        for (const snapshot of TempUserPK.docs) {
            var result2 = [];

            var snapshotOfUsersPerTest = await getDoc(doc(firestore, 'Send-Tests/' + snapshot.id + '/Users/' + userPK));

            var tempUsersDetails = (await getDoc(doc(firestore, 'Users', snapshotOfUsersPerTest.id)))._document.data.value.mapValue.fields;

            //workout and save the following
            let tempPercent = (snapshotOfUsersPerTest._document?.data.value.mapValue.fields['Top-Total-Marks'].stringValue / snapshotOfUsersPerTest._document?.data.value.mapValue.fields['Default-Questions'].stringValue.split(',').length) * 100;

            if (snapshotOfUsersPerTest._document?.data.value.mapValue.fields['Top-Total-Marks'].stringValue == undefined) {
                tempPercent = 0;
            }

            result2.push({
                //User details about the test
                Started: snapshotOfUsersPerTest._document?.data.value.mapValue.fields.Started?.booleanValue,
                Completed: snapshotOfUsersPerTest._document?.data.value.mapValue.fields.Completed?.booleanValue,
                TotalMarks: snapshotOfUsersPerTest._document?.data.value.mapValue.fields['Total-Marks'].integerValue,
                Questions: snapshotOfUsersPerTest._document?.data.value.mapValue.fields['Default-Questions'].stringValue,
                Attempts: snapshotOfUsersPerTest._document?.data.value.mapValue.fields.Attempt.integerValue,
                Percentage: tempPercent,

                //User personal details
                FName: tempUsersDetails['Personal-Details'].mapValue.fields.FName.stringValue,
                LName: tempUsersDetails['Personal-Details'].mapValue.fields.LName.stringValue,
                IDNumber: tempUsersDetails['Personal-Details'].mapValue.fields.ID.stringValue,
                Cell: tempUsersDetails['Contact-Details'].mapValue.fields.Cell.stringValue,
                Email: tempUsersDetails['Contact-Details'].mapValue.fields.Email.stringValue,
                Group: tempUsersDetails.Group.stringValue,
                UserPK: snapshotOfUsersPerTest.id
            });

            var tempTestFullDetails = (await getDoc(doc(firestore, 'Stored-Tests', snapshot._document.data.value.mapValue.fields['Test-Details'].mapValue.fields.Code.stringValue)))._document?.data.value.mapValue.fields;

            var options = { year: 'numeric', month: 'long', day: 'numeric' };

            let tempTestDetails = {
                ExpiryDate: new Date(snapshot._document?.data.value.mapValue.fields['Expiry-Date'].timestampValue.seconds * 1000).toLocaleDateString([], options),
                SentDate: new Date(snapshot._document?.data.value.mapValue.fields['Sent-Date'].timestampValue.seconds * 1000).toLocaleDateString([], options),
                Version: snapshot._document?.data.value.mapValue.fields['Test-Details'].mapValue.fields.Version.stringValue,
                MaxAttempts: snapshot._document?.data.value.mapValue.fields['Maximum-Amount-Of-Attempts'].integerValue,
                TestSentID: snapshot.id,
                CategoryName: await (async function () {
                    let cats = await getCategorys();
                    for (let name of cats) {
                        if (name.value == tempTestFullDetails.Category.stringValue) {
                            return name.label;
                        }
                    }
                })(),
                Category: tempTestFullDetails.Category.stringValue,
                TestName: tempTestFullDetails.Name.stringValue,
                TestPK: snapshot._document?.data.value.mapValue.fields['Test-Details'].mapValue.fields.Code.stringValue
            };

            resultMain.push({ Results: result2, TestDetails: tempTestDetails });
        }
        let finalResult = {};
        for (let result of resultMain) {
            if (finalResult[result.TestDetails.TestName]) {
                finalResult[result.TestDetails.TestName].push(result);
            } else {
                finalResult[result.TestDetails.TestName] = [result];
            }
        }
        return finalResult;
    } catch (error) {
        //show an error message
        console.error(error);
        return false;
    }
}

//unarchive
export async function unArchiveTest(testPK, allocateTo) {
    try {
        const batch = writeBatch(firestore);

        batch.update(doc(firestore, 'Stored-Tests/' + testPK), { archived: false, Category: allocateTo });

        await batch.commit();

        return { success: true };
    } catch (e) {
        return { error: true };
    }
}

export async function unArchiveUser(userPK, groupPK) {
    try {
        const batch = writeBatch(firestore);

        batch.update(doc(firestore, 'Users/' + userPK), { archived: false, Group: groupPK });

        const user = await getDoc(doc(firestore, 'Users/' + userPK));

        batch.update(doc(firestore, 'Groups/' + groupPK), { 'Staff-Count': increment(1) });

        await batch.commit();
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: true };
    }
}

export async function unArchiveCategory(categoryPK) {
    try {
        const batch = writeBatch(firestore);

        batch.update(doc(firestore, 'Categorys/' + categoryPK), { archived: false });

        await batch.commit();

        return { success: true };
    } catch (e) {
        console.error(e);

        return { error: true };
    }
}

export async function unArchiveGroup(groupPK) {
    try {
        const batch = writeBatch(firestore);
        batch.update(doc(firestore, 'Groups/' + groupPK), { archived: false });
        await batch.commit();
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: true };
    }
}

//archive
export async function archiveTest(testPK) {
    try {
        const batch = writeBatch(firestore);
        batch.update(doc(firestore, 'Stored-Tests/' + testPK), { archived: true });
        await batch.commit();
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: true };
    }
}

export async function archiveUser(userPK) {
    try {
        const user = await getDoc(doc(firestore, 'Users/' + userPK));

        let groupPK = user._document.data.value.mapValue.fields.Group.stringValue;

        const batch = writeBatch(firestore);

        batch.update(doc(firestore, 'Users/' + userPK), { archived: true });

        batch.update(doc(firestore, 'Groups/' + groupPK), { 'Staff-Count': increment(-1) });

        await batch.commit();

        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: true };
    }
}

export async function archiveCategory(categoryPK, allocateToPK) {
    try {
        const batch = writeBatch(firestore);

        var StoredTests = await getDocs(query(collection(firestore, 'Stored-Tests'), where('Category', '==', categoryPK)));

        for (let _document of StoredTests.docs) {
            batch.update(doc(firestore, 'Stored-Tests/' + _document.id), { Category: allocateToPK });
        }

        batch.update(doc(firestore, 'Categorys/' + categoryPK), { archived: true });

        await batch.commit();

        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: true };
    }
}

export async function archiveGroup(groupPK, allocateToPK) {
    try {
        const batch = writeBatch(firestore);

        var StoredTests = await getDocs(query(collection(firestore, 'Users'), where('Group', '==', groupPK)));

        for (let _document of StoredTests.docs) {
            batch.update(doc(firestore, 'Groups/' + groupPK), { 'Staff-Count': increment(-1) });
            batch.update(doc(firestore, 'Groups/' + allocateToPK), { 'Staff-Count': increment(1) });
            batch.update(doc(firestore, 'Users/' + _document.id), { Group: allocateToPK });
        }

        batch.update(doc(firestore, 'Groups/' + groupPK), { archived: true });

        await batch.commit();
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: true };
    }
}

export async function getArchivedTests() {
    try {
        var TempUserPK = await getDocs(collection(firestore, 'Stored-Tests'));
        var result2 = [];
        for (const snapshot of TempUserPK.docs) {
            if (snapshot._document?.data.value.mapValue.fields?.archived?.booleanValue) {
                let TempTestSendOut = await getDoc(doc(firestore, 'Stored-Tests/' + snapshot.id + '/Versions', snapshot._document?.data?.value?.mapValue?.fields?.['Latest-Version']?.stringValue));
                result2.push({
                    Name: snapshot._document?.data?.value?.mapValue?.fields?.Name?.stringValue || '',
                    CatPK: snapshot._document?.data?.value?.mapValue?.fields?.Category?.stringValue,
                    CreatedBy: snapshot._document.data?.value?.mapValue?.fields?.['Created-By'].stringValue,
                    CreatedDate: snapshot._document.data?.value?.mapValue?.fields?.['Created-Date'].timestampValue,
                    LatestVersion: snapshot._document.data?.value?.mapValue?.fields?.['Latest-Version'].stringValue,
                    TestPK: snapshot.id,
                    TestSendOut: TempTestSendOut?._document?.data?.value.mapValue.fields['Sent-Out']?.booleanValue,
                    ActiveQuestions: TempTestSendOut?._document?.data?.value.mapValue.fields['Active-Questions'].stringValue
                });
            }
        }
        return result2;
    } catch (err) {
        console.error('error', err);
        return false;
    }
}

export async function getArchivedUsers() {
    try {
        var TempUserPK = await getDocs(collection(firestore, 'Users'));

        // map through the docs and add into array
        var result2 = [];
        for (const snapshot of TempUserPK.docs) {
            if (snapshot._document.data.value.mapValue.fields?.archived?.booleanValue) {
                result2.push({
                    FName: snapshot._document.data.value.mapValue.fields['Personal-Details'].mapValue.fields.FName.stringValue,
                    LName: snapshot._document.data.value.mapValue.fields['Personal-Details'].mapValue.fields.LName.stringValue,
                    IDNumber: snapshot._document.data.value.mapValue.fields['Personal-Details'].mapValue.fields.ID.stringValue,
                    Cell: snapshot._document.data.value.mapValue.fields['Contact-Details'].mapValue.fields.Cell.stringValue,
                    Email: snapshot._document.data.value.mapValue.fields['Contact-Details'].mapValue.fields.Email.stringValue,
                    Group: await getGroupNameFromId(snapshot._document.data.value.mapValue.fields.Group.stringValue),
                    GroupPK: snapshot._document.data.value.mapValue.fields.Group.stringValue,
                    UserPK: snapshot.id
                });
            }
        }

        return result2;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function getTestsTakenByUser(userPK) {
    try {
        let response = {};
        var QueryA = await getDocs(query(collection(firestore, 'Send-Tests'), where('UsersPK', 'array-contains', userPK)));
        for (let docx of QueryA.docs) {
            let ref = 'Stored-Tests/' + docx._document.data.value.mapValue.fields['Test-Details'].mapValue.fields.Code.stringValue;
            let key = (await getDoc(doc(firestore, ref)))._document.data.value.mapValue.fields.Name.stringValue;
            if (!response[key]) {
                response[key] = [];
            }
            response[key].push({
                id:docx.id,
                date:docx._document.data?.value?.mapValue?.fields?.['Sent-Date'].timestampValue,
                version:docx._document.data?.value?.mapValue?.fields?.["Test-Details"].mapValue.fields.Version.stringValue,
            });
        }

        return response;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function getArchivedCategorys() {
    try {
        const res = [];
        const all = await getDocs(collection(firestore, 'Categorys'));
        if (all.docs.length) {
            for (let snapshot of all.docs) {
                if (snapshot._document.data.value.mapValue.fields?.archived?.booleanValue) {
                    res.push({
                        value: snapshot.id,
                        label: snapshot._document.data.value.mapValue.fields.Name.stringValue
                    });
                }
            }
        }
        return res;
    } catch (e) {
        console.error(e);
    }
}

export async function getArchivedGroups() {
    try {
        var TempUserPK = await getDocs(collection(firestore, 'Groups'));
        let res = [];
        for (const snapshot of TempUserPK.docs) {
            if (snapshot._document.data.value.mapValue.fields?.archived?.booleanValue) {
                res.push({
                    Name: snapshot._document.data.value.mapValue.fields.Name.stringValue,
                    Amount: snapshot._document.data.value.mapValue.fields['Staff-Count'].integerValue,
                    id: snapshot.id
                });
            }
        }
        return res;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function getTestDetailsFromSentCode(testID) {
    try {
        var StoredTest = await getDoc(doc(firestore, 'Send-Tests/' + testID));
        let ogPK = StoredTest._document.data.value.mapValue.fields['Test-Details'].mapValue.fields.Code.stringValue;
        const snapshot = await getDoc(doc(firestore, 'Stored-Tests/' + ogPK));
        return {
            Name: snapshot._document.data.value.mapValue.fields?.Name?.stringValue || '',
            CatPK: snapshot._document.data.value.mapValue.fields.Category.stringValue,
            Category: (await getDoc(doc(firestore, 'Categorys/' + snapshot._document.data.value.mapValue.fields.Category.stringValue)))._document.data.value.mapValue.fields.Name.stringValue,
            CreatedBy: snapshot._document.data.value.mapValue.fields['Created-By'].stringValue,
            CreatedDate: snapshot._document.data.value.mapValue.fields['Created-Date'].timestampValue,
            LatestVersion: snapshot._document.data.value.mapValue.fields['Latest-Version'].stringValue,
            TestPK: snapshot.id
        };
    } catch (e) {
        console.error(e);
        return false;
    }
}

export default async function handler(req, res) {
    try {
        switch (req.body.MethodName) {
            /*archive methods*/
            case 'archiveTest':
                return res.status(200).json(await archiveTest(req.body.InputData.testPK));
            case 'archiveUser':
                return res.status(200).json(await archiveUser(req.body.InputData.userPK));
            case 'archiveCategory':
                return res.status(200).json(await archiveCategory(req.body.InputData.categoryPK, req.body.InputData.allocateTo));
            case 'archiveGroup':
                return res.status(200).json(await archiveGroup(req.body.InputData.groupPK, req.body.InputData.allocateTo));
            /*unarchive methods*/
            case 'unArchiveTest':
                return res.status(200).json(await unArchiveTest(req.body.InputData.testPK, req.body.InputData.allocateTo));
            case 'unArchiveUser':
                return res.status(200).json(await unArchiveUser(req.body.InputData.userPK, req.body.InputData.groupPK));
            case 'unArchiveCategory':
                return res.status(200).json(await unArchiveCategory(req.body.InputData.categoryPK));
            case 'unArchiveGroup':
                return res.status(200).json(await unArchiveGroup(req.body.InputData.groupPK));
            case 'getTestsTakenByUser':
                return res.status(200).json(await getTestsTakenByUser(req.body.UserPK));
            /* User Methods */
            case 'getArchivedCategorys':
                return res.status(200).json(await getArchivedCategorys());
            case 'getArchivedGroups':
                return res.status(200).json(await getArchivedGroups());
            case 'getArchivedUsers':
                return res.status(200).json(await getArchivedUsers());
            case 'GetAllUsersToDisplay':
                return res.status(200).json(await GetAllUsersToDisplay());
            case 'AddNewDBUser':
                return res.status(200).json(await AddNewDBUser(req.body.InputData));
            case 'GetUserSpecificDetails':
                return res.status(200).json(await GetUserSpecificDetails(req.body.InputData));
            case 'EditDBUser':
                return res.status(200).json(await EditDBUser(req.body.InputData.UserDetails, req.body.InputData.UserPK));

            /* Test methods */
            case 'getArchivedTests':
                return res.status(200).json(await getArchivedTests());
            case 'AddNewTest':
                return res.status(200).json(await AddNewTest(req.body.InputData.tempDBData, req.body.InputData.ExtraTestDetails));
            case 'GetAllTestsToDisplay':
                return res.status(200).json(await GetAllTestsToDisplay());
            case 'GetAllDetailOfTestToEdit':
                return res.status(200).json(await GetAllDetailOfTestToEdit(req.body.InputData));
            case 'EditCurrentTest':
                return res.status(200).json(await EditCurrentTest(req.body.InputData, req.body.ExtraTestDetails));
            case 'DBSendTestOut':
                return res.status(200).json(await DBSendTestOut(req.body.InputData, req.body.testDetails, req.body.tempExpiryDate, req.body.ActiveQuestions, req.body.MaxAmountOfAttempts));
            case 'newGroup':
                return res.status(200).json(await newGroup(req.body.InputData));
            case 'getCategorys':
                return res.status(200).json(await getCategorys(req.body.InputData));

            case 'getTestDetailsFromSentCode':
                return res.status(200).json(await getTestDetailsFromSentCode(req.body.TestSentID));

            case 'updateCategory':
                return res.status(200).json(await updateCategory(req.body.InputData, req.body.CatPK));
            case 'newCategory':
                return res.status(200).json(await newCategory(req.body.InputData));
            case 'getAllGroups':
                return res.status(200).json(await getAllGroups());
            case 'updateGroup':
                return res.status(200).json(await updateGroup(req.body.InputData));
            case 'getAllUsersWhoTookSpecificTest':
                return res.status(200).json(await getAllUsersWhoTookSpecificTest(req.body.TestDetails));
            case 'GetUserSpecificTestDetails':
                return res.status(200).json(await GetUserSpecificTestDetails(req.body.TestSentID, req.body.UserPK));

            //Take-Test
            case 'getBasicTestData':
                return res.status(200).json(await getBasicTestData(req.body.TestID));
            case 'getBasicTestDataFromPK':
                return res.status(200).json(await getBasicTestDataFromPK(req.body.TestID));
            case 'CheckIfUserCanAccessTest':
                return res.status(200).json(await CheckIfUserCanAccessTest(req.body.TestID, req.body.UserID));
            case 'SaveShuffledQuestionsForUser':
                return res.status(200).json(await SaveShuffledQuestionsForUser(req.body.TestID, req.body.UserID, req.body.ShuffledQuestions));
            case 'getQuestion':
                return res.status(200).json(await GetQuestion(req.body.TestPKCode, req.body.TestVersion, req.body.NextQuestionNumber));
            case 'SaveUsersAnswer':
                return res.status(200).json(await SaveUsersAnswer(req.body.TestPKCode, req.body.UserPK, req.body.QuestionNumber, req.body.constUserAttempt, req.body.Answer, req.body.Correct));
            case 'dbUpdateUserQuestionsRemaining':
                return res.status(200).json(await dbUpdateUserQuestionsRemaining(req.body.TestPKCode, req.body.UserPK, req.body.QuestionsLeft));
            case 'dbGetUsersTotalMarks':
                return res.status(200).json(await dbGetUsersTotalMarks(req.body.TestPKCode, req.body.UserPK));
            default:
                res.status(404).json({ error: 'No method found' });
        }
    } catch (error) {
        res.status(500).json({
            error
        });
    }
}
