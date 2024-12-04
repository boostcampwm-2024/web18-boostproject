<img width="1600" alt="기본 배너" src="https://github.com/user-attachments/assets/a3969a94-850e-4a41-b588-d05f4386f752">

## 🎵 iNear 프로젝트 개요

iNear는 오직 음악으로만 소통할 수 있는 공간을 필요로 하는 아티스트와 팬들을 위한 실시간 앨범 감상 서비스입니다.

앨범 발매 시간에 맞춰 열리는 라이브 세션에서 음악을 감상하며, 다른 팬들과 채팅으로 감상평을 나눌 수 있습니다.

iNear와 함께 같은 취향을 가진 팬들과 좋아하는 아티스트 앨범 발매일의 특별한 순간을 만들어보세요.

<br>

## 🚀 핵심 기능 - 앨범 스트리밍

> inear는 아티스트의 신규 앨범을 실시간으로 청취할 수 있습니다

- 앨범 발매 라이브 세션이 진행되기 3일 전에 홈페이지에 배너가 등록이 됩니다
- 앨범 발매 시간에 맞추어 세션 안에서 라이브로 신곡을 들을 수 있습니다



https://github.com/user-attachments/assets/25ba6871-809e-4a0e-86ac-ee321d661645


<br>

## ✨ 문제 해결 - 앨범 스트리밍

> 각 제목에 상세한 정보를 확인할 수 있는 링크가 적용되어 있습니다.  
> 추가로 확인하고싶으신 기록들은 제목을 클릭해주세요.

### [1️⃣ HLS 프로토콜에 관한 정리 및 FFmpeg 사용기](https://github.com/boostcampwm-2024/web18-inear/wiki/%F0%9F%9A%80-HLS-%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C%EC%97%90-%EA%B4%80%ED%95%9C-%EC%A0%95%EB%A6%AC-%EB%B0%8F-FFmpeg-%EC%82%AC%EC%9A%A9%EA%B8%B0)

**HLS**를 메인 음악 스트리밍 프로토콜로 선택하게 되었습니다.

이는 보다 적은 리소스를 소모하지만 많은 사용자를 처리하고, 높은 디바이스 호환성을 가진다는 특징에서 해당 프로토콜을 선택하게 되었습니다.

---

### [2️⃣ 앨범 단위로 스트리밍 하기 (with HLS)](<https://github.com/boostcampwm-2024/web18-inear/wiki/%F0%9F%9A%80-%EC%95%A8%EB%B2%94-%EB%8B%A8%EC%9C%84%EB%A1%9C-%EC%8A%A4%ED%8A%B8%EB%A6%AC%EB%B0%8D-%ED%95%98%EA%B8%B0-(with-HLS)>)

음악의 **구간별 소리**를 담는 **.ts(세그먼트)** 파일과 이 세그먼트 **파일의 순서 정보**를 저장하는 .m3u8이라는 파일을 기반으로 동작하는 hls에서  

하나의 앨범에 들어간 여러 노래들을 끊기지 않고 스트리밍하기 위해서는 탄탄한 로직 설계가 필요했습니다.

그래서 하나의 음원 파일(.m3u8)을 모두 재생한 경우 앨범의 다음 음원 파일(.m3u8)을 요청하여 재생하도록 구현했습니다.

---

### [3️⃣ HLS로 음악 주고받기](https://github.com/boostcampwm-2024/web18-inear/wiki/%F0%9F%9A%80-HLS%EB%A1%9C-%EC%9D%8C%EC%95%85-%EC%A3%BC%EA%B3%A0%EB%B0%9B%EA%B8%B0)

라이브 스트리밍 플랫폼인 만큼 여러 클라이언트끼리 서로 같은 시간에 같은 음악을 듣는 것이 가장 중요했습니다.

유저들 간 다른 부분을 듣고 있다면, 채팅이라는 소통 수단에서 서로간의 공감대가 상이해지는 우려가 있었습니다.

따라서, 사용자들 간 재생 시간 동기화를 위해 .m3u8에 기록된 세그먼트 정보 중 이미 재생된 세그먼트 정보를 제거하여 사용자에게 반환하였습니다.

---

<br>

## 🚀 핵심 기능 - 실시간 공감(채팅, 투표)

> inear는 앨범 청취를 하면서 다른 사용자들과 소통할 수 있습니다

- 같은 팬들끼리 서로 실시간 채팅으로 다 같이 소통할 수 있습니다
- 앨범 스트리밍을 하면서 가장 즐겁게 감상한 노래에 유저들이 실시간으로 투표를 진행할 수 있습니다

![chatting](https://github.com/user-attachments/assets/8ae13dbc-31a5-4fa4-8fc4-ccb479cf88bb)

<br>

## ✨ 문제 해결 - 채팅방에서 소통

### [1️⃣ Socket.io 최(강)적화](<https://github.com/boostcampwm-2024/web18-inear/wiki/%F0%9F%9A%80-Socket.io-%EC%B5%9C(%EA%B0%95)%EC%A0%81%ED%99%94>)

소통에서의 가장 중요한 부분은 역시 실시간이었습니다.

각 라이브 세션 안에서 유저들끼리 빠른 응답과 낮은 지연 시간으로 채팅과 투표 기능을 서비스해야했고,

이를 위해 실시간 이벤트 핸들링이나, 양방향 통신 등의 여러 기능들이 지원되는 Socket.IO를 채택했습니다.

<br>

## 🧩 서비스 아키텍처

![image](https://github.com/user-attachments/assets/d829fa2f-b422-48e6-acf7-3c229a6091e6)

<br>

## 🚀 기술 스택

<markdown-accessiblity-table data-catalyst=""><table>

  <tbody>
    <tr>
      <td align="center" width="160px">ALL</td>
      <td align="center" width="560px">
        <img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" height="24px"/>
        <img src="https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=node.js&logoColor=white" height="24px"/>
        <img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" height="24px"/>
        <img src="https://img.shields.io/badge/HLS.JS-black?style=for-the-badge&logoColor=white" height="24px"/>
      </td>
    </tr>
    <tr>
      <td align="center" width="160px">FE</td>
      <td align="center" width="560px">
        <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" height="24px"/>
        <img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" height="24px"/>
        <img src="https://img.shields.io/badge/reactquery-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" height="24px"/>
        <img src="https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" height="24px"/>
        <img src="https://img.shields.io/badge/zustand-443f39?style=for-the-badge&logo=zustand&logoColor=white" height="24px"/>
      </td>
    </tr>
    <tr>
      <td align="center" width="160px">BE</td>
      <td align="center" width="560px">
        <img src="https://img.shields.io/badge/nest.js-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" height="24px"/>
        <img src="https://img.shields.io/badge/typeorm-FE0803?style=for-the-badge&logo=typeorm&logoColor=white" height="24px"/>
        <img src="https://img.shields.io/badge/ffmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white" height="24px"/>
        <img src="https://img.shields.io/badge/redis-FF4438?style=for-the-badge&logo=redis&logoColor=white" height="24px"/>
        <img src="https://img.shields.io/badge/MySql-4479A1?style=for-the-badge&logo=MySql&logoColor=white" height="24px"/>
        <img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" height="24px"/>
        <img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" height="24px"/>
      </td>
    </tr>
  </tr>
   
</tbody></table></markdown-accessiblity-table>

<br>

## 💪 팀원 소개

<markdown-accessiblity-table data-catalyst=""><table>

  <tbody>
    <tr>
    <td align="center" width="160px">FE</td>
    <td align="center" width="160px">BE</td>
    <td align="center" width="160px">BE</td>
    <td align="center" width="160px">BE</td>
  </tr>
    <tr height="160px">
    <td align="center" width="160px">
      <a href="https://github.com/chaeryeon823"><img src="https://avatars.githubusercontent.com/u/87600308?v=4" style="max-width: 100%;"></a>
    </td>
    <td align="center" width="160px">
      <a href="https://github.com/Kontae"><img src="https://avatars.githubusercontent.com/u/91358761?v=4" style="max-width: 100%;"></a>
    </td> 
    <td align="center" width="160px">
      <a href="https://github.com/rdyjun"><img src="https://avatars.githubusercontent.com/u/45596014?v=4" style="max-width: 100%;"></a>
    </td>
    <td align="center" width="160px">
      <a href="https://github.com/yoonseo-han"><img src="https://avatars.githubusercontent.com/u/51229971?v=4" style="max-width: 100%;"></a>
    </td>
  </tr>
  <tr height="50px">
    <td align="center" width="160px">
      <a href="https://github.com/chaeryeon823">J005 강채련</a>
    </td>
    <td align="center" width="160px">
      <a href="https://github.com/Kontae">J011 고은태</a>
    </td>
    <td align="center" width="160px">
      <a href="https://github.com/rdyjun">J246 주성준</a>
    </td>
    <td align="center" width="160px">
      <a href="https://github.com/yoonseo-han">J275 한윤서</a>
    </td>
  </tr>
</tbody></table></markdown-accessiblity-table>
