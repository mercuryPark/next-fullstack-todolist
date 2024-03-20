// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    deleteDoc,
    updateDoc,
    setDoc,
    getDoc,
    doc,
    Timestamp,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGE_SENDER_ID,
    appId: process.env.APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 모든 할 일 가져오기
export async function fetchTodos() {
    const querySnapshot = await getDocs(collection(db, "todos"));

    if (querySnapshot.empty) {
        return [];
    }

    const fetchedTodos = [];

    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());

        const aTodo = {
            id: doc.id,
            title: doc.data()["title"],
            isDone: doc.data()["isDone"],
            created_at: doc.data()["created_at"].toDate(),
        };

        fetchedTodos.push(aTodo);
    });

    return fetchedTodos;
}

// 할 일 추가하기
export async function addATodos({ title }) {
    const newTodoRef = doc(collection(db, "todos"));
    const createdAtTimestamp = Timestamp.fromDate(new Date());

    const newTodoData = {
        id: newTodoRef.id,
        title: title,
        isDone: false,
        created_at: createdAtTimestamp.toDate(),
    };
    await setDoc(newTodoRef, newTodoData);
    return newTodoData;
}

// 단일 할 일 가져오기
export async function fetchATodo(id) {
    const todoDocRef = doc(db, "todos", id);
    const todoDocSnap = await getDoc(todoDocRef);

    if (id === null) {
        return null;
    }

    if (todoDocSnap.exists()) {
        console.log("Document data:", todoDocSnap.data());

        const fetchedTodo = {
            id: todoDocSnap.id,
            title: todoDocSnap.data()["title"],
            isDone: todoDocSnap.data()["isDone"],
            created_at: todoDocSnap.data()["created_at"].toDate(),
        };

        return fetchedTodo;
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        return null;
    }
}

// 단일 할 일 삭제
export async function deleteATodo(id) {
    if (id === null) {
        return null;
    }

    const fetchedTodo = await fetchATodo(id);

    if (fetchedTodo === null) {
        return null;
    }

    await deleteDoc(doc(db, "todos", id));
    return fetchedTodo;
}

// 단일 할 일 수정
export async function editATodo(id, { title, isDone }) {
    if (id === null) {
        return null;
    }

    const fetchedTodo = await fetchATodo(id);

    const todoRef = doc(db, "todos", id);

    if (fetchedTodo === null) {
        return null;
    }

    await updateDoc(todoRef, {
        title: title,
        isDone: isDone,
    });

    return {
        id: id,
        title: title,
        isDone: isDone,
        created_at: fetchedTodo.created_at,
    };
}
