# Firebase Firestore DB 구조 예시

## assets 컬렉션
- assetId (문서 ID)
  - name: 자산명
  - description: 설명
  - serialNumber: 시리얼번호
  - metadataURI: 메타데이터 URI
  - ownerAddress: 소유자 지갑 주소
  - tokenId: 블록체인 NFT ID
  - status: 등록/판매중/거래완료 등

## offers 컬렉션
- offerId (문서 ID)
  - tokenId: NFT 토큰 ID
  - sellerAddress: 판매자 지갑 주소
  - price: 가격(wei)
  - active: true/false
  - createdAt: 생성일시 