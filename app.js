// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCa1rKcGYEAOCVsNWcxjBwj7tkLLHPQPs",
  authDomain: "trove-28de5.firebaseapp.com",
  projectId: "trove-28de5",
  storageBucket: "trove-28de5.firebasestorage.app",
  messagingSenderId: "906681488094",
  appId: "1:906681488094:web:597d7eef813cd564c8a84f",
  measurementId: "G-KLRRLM8V3J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById('google-login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');

loginBtn.addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    alert('로그인 실패: ' + error.message);
  }
});

logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
  } catch (error) {
    alert('로그아웃 실패: ' + error.message);
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    userInfo.textContent = user.displayName + ' (' + user.email + ')';
  } else {
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    userInfo.textContent = '';
  }
});

// 이후 db를 사용하여 Firestore 연동 코드 작성

document.getElementById('assetForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const serialNumber = document.getElementById('serialNumber').value;
  const metadataURI = document.getElementById('metadataURI').value;

  // Firestore에 자산 정보 저장
  await db.collection('assets').add({

    
    name,
    description,
    serialNumber,
    metadataURI,
    ownerAddress: "0x...", // 실제 메타마스크 등에서 받아오기
    status: "등록"
  });

  alert('자산이 등록되었습니다!');
  // 자산 목록 새로고침 등 추가 구현
}); 