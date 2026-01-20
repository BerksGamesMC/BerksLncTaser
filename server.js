import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// Firebase Yapılandırması
const firebaseConfig = {
    apiKey: "AIzaSyDky0jC4vlRZ66D10kp8GEXXryymaPFY2Q",
    authDomain: "berks-47dbc.firebaseapp.com",
    projectId: "berks-47dbc",
    storageBucket: "berks-47dbc.firebasestorage.app",
    messagingSenderId: "384612310366",
    appId: "1:384612310366:web:6fe0e771f389782270c3cf",
    measurementId: "G-FBYH92LHQ4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// HTML Elementleri
const loginArea = document.getElementById('login-area');
const registerArea = document.getElementById('register-area');
const dashboardArea = document.getElementById('dashboard-area');
const infoMsg = document.getElementById('info-msg');

// Mesaj Gösterme Fonksiyonu
function showMsg(text, isError = true) {
    infoMsg.textContent = text;
    infoMsg.className = isError ? 'message-box error' : 'message-box success';
    infoMsg.style.display = 'block';
}

// OTURUM TAKİBİ
onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
        loginArea.classList.add('hidden');
        registerArea.classList.add('hidden');
        dashboardArea.classList.remove('hidden');
        infoMsg.style.display = 'none';
    } else {
        dashboardArea.classList.add('hidden');
        loginArea.classList.remove('hidden');
    }
});

// KAYIT OL
document.getElementById('btn-register').addEventListener('click', async () => {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCred.user);
        showMsg("Kayıt başarılı! Lütfen mailini kontrol et ve doğrula.", false);
        document.getElementById('reg-email').value = "";
        document.getElementById('reg-password').value = "";
    } catch (error) {
        handleError(error);
    }
});

// GİRİŞ YAP
document.getElementById('btn-login').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        if (!userCred.user.emailVerified) {
            showMsg("Lütfen önce e-postanızı doğrulayın.");
            await signOut(auth);
        }
    } catch (error) {
        handleError(error);
    }
});

// ŞİFRE SIFIRLA
document.getElementById('btn-forgot-pw').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    if (!email) {
        showMsg("Şifre sıfırlama linki için e-posta alanını doldurun.");
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        showMsg("Şifre sıfırlama bağlantısı gönderildi.", false);
    } catch (error) {
        handleError(error);
    }
});

// ÇIKIŞ YAP
document.getElementById('btn-logout').addEventListener('click', () => {
    signOut(auth);
});

// HATA TÜRKÇELEŞTİRME
function handleError(error) {
    switch (error.code) {
        case 'auth/email-already-in-use': showMsg("Bu e-posta zaten kayıtlı."); break;
        case 'auth/invalid-email': showMsg("Geçersiz e-posta adresi."); break;
        case 'auth/weak-password': showMsg("Şifre en az 6 karakter olmalı."); break;
        case 'auth/invalid-credential': showMsg("Hatalı e-posta veya şifre."); break;
        case 'auth/too-many-requests': showMsg("Çok fazla deneme yaptınız. Biraz bekleyin."); break;
        default: showMsg("Bir hata oluştu: " + error.message);
    }
}
