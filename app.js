// Firebase SDK 초기화 (실제 프로젝트 config로 적용)
const firebaseConfig = {
  apiKey: "AIzaSyDCa1rKcGYEAOCVsNWcxjBwj7tkLLHPQPs",
  authDomain: "trove-28de5.firebaseapp.com",
  projectId: "trove-28de5",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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