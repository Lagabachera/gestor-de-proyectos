// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

// Función para registrar un nuevo usuario
function registerUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Usuario registrado:", user);
            toggleTaskContainer();
        })
        .catch((error) => {
            console.error("Error al registrar:", error.message);
        });
}

// Función para iniciar sesión
function loginUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Usuario inició sesión:", user);
            toggleTaskContainer();
            loadTasks(); // Cargar tareas después de iniciar sesión
        })
        .catch((error) => {
            console.error("Error al iniciar sesión:", error.message);
        });
}

// Monitorear el estado de autenticación
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuario autenticado:", user);
        toggleTaskContainer();
        loadTasks(); // Cargar tareas si el usuario está autenticado
    } else {
        console.log("No hay usuario autenticado");
        document.getElementById("task-container").style.display = "none";
    }
});

// Función para alternar el contenedor de tareas
function toggleTaskContainer() {
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("task-container").style.display = "block";
}

// Función para agregar una tarea a Firestore
async function addTask() {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-desc').value;

    try {
        const docRef = await addDoc(collection(db, "tasks"), {
            title: title,
            description: description,
            status: "incomplete",
            createdAt: new Date()
        });
        console.log("Tarea agregada con ID:", docRef.id);
        loadTasks(); // Volver a cargar las tareas después de agregar una nueva
    } catch (e) {
        console.error("Error al agregar tarea:", e);
    }
}

// Función para cargar tareas desde Firestore
async function loadTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // Limpiar la lista antes de volver a cargar

    const querySnapshot = await getDocs(collection(db, "tasks"));
    querySnapshot.forEach((doc) => {
        const task = doc.data();
        const listItem = document.createElement("li");
        listItem.textContent = `${task.title} - ${task.description}`;
        taskList.appendChild(listItem);
    });
}
