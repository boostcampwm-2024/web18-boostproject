<img width="1600" alt="기본 배너" src="https://github.com/user-attachments/assets/a3969a94-850e-4a41-b588-d05f4386f752">

## 🎵 inear 프로젝트 개요

iNear는 소통 창구가 부족했던 장르의 아티스트와 팬들을 위한 실시간 앨범 감상 서비스입니다.

앨범 발매 시간에 맞춰 열리는 라이브 세션에서 음악을 감상하며, 다른 팬들과 채팅으로 감상평을 나눌 수 있습니다.

iNear와 함께 같은 취향을 가진 팬들과 좋아하는 아티스트 앨범 발매일의 특별한 순간을 만들어보세요.

## 🚀 핵심 기능 - 앨범 스트리밍

> inear는 아티스트의 신규 앨범을 실시간으로 청취할 수 있습니다

- 앨범 발매 라이브 세션이 진행되기 3일 전에 홈페이지에 배너가 등록이 됩니다
- 유저는 미리 들어와서 가수의 이전 앨범을 함께 들을 수 있습니다
- 앨범 발매 시간에 맞추어 세션 안에서 라이브로 신곡을 들을 수 있습니다

![메인페이지](https://github.com/user-attachments/assets/1fc35a46-09c1-4dff-b1a1-6b8aef0427e5)

## ✨ 문제 해결 - 앨범 스트리밍

### [1️⃣ FFmpeg 및 HLS 통신에 관한 정리](https://github.com/boostcampwm-2024/web18-inear/wiki/%F0%9F%9A%80-FFmpeg-%EB%B0%8F-HLS-%ED%86%B5%EC%8B%A0%EC%97%90-%EA%B4%80%ED%95%9C-%EC%A0%95%EB%A6%AC)

우선 저희 팀에서는 **HLS**을 메인 음악 스트리밍 프로토콜로 선택을 하게 되었습니다.

해당 프로토콜을 고른 이유와 HLS의 기본적인 동작 방식에 관한 내용을 해당 글에 정리하였습니다.

---

### [2️⃣ 앨범 단위로 스트리밍 하기 (with HLS)](<https://github.com/boostcampwm-2024/web18-inear/wiki/%F0%9F%9A%80-%EC%95%A8%EB%B2%94-%EB%8B%A8%EC%9C%84%EB%A1%9C-%EC%8A%A4%ED%8A%B8%EB%A6%AC%EB%B0%8D-%ED%95%98%EA%B8%B0-(with-HLS)>)

해당 글에 적힌 것처럼 m3u8과 ts파일을 기반으로 동작하는 hls에서 하나의 앨범에 들어간 여러 노래들을 끊기지 않고 스트리밍하기 위해서는 탄탄한 로직 설계가 필요했습니다.

그래서 저희가 다음과 같은 고민들을 거쳐 구현을 진행하게 되었습니다.

---

### [3️⃣ HLS로 음악 주고받기](https://github.com/boostcampwm-2024/web18-inear/wiki/%F0%9F%9A%80-HLS%EB%A1%9C-%EC%9D%8C%EC%95%85-%EC%A3%BC%EA%B3%A0%EB%B0%9B%EA%B8%B0)

마지막으로 가장 중요한 부분은 여러 클라이언트끼리 서로 같은 시간에 같은 음악을 듣는 것이겠죠?

inear 서비스는 스트리밍 + 실시간 소통 플랫폼입니다.

유저들 간 다른 부분을 듣고 있다면, 서로 공감대가 상이해지는 우려가 있었습니다.

따라서, 유저들 간 동기화를 위한 싱크 처리를 고민하게 되었습니다.

---

## 🚀 핵심 기능 - 채팅방에서 소통

> inear는 앨범 청취를 하면서 다른 사용자들과 소통할 수 있습니다

- 같은 팬들끼리 서로 실시간 채팅으로 다같이 소통할 수 있습니다
- 채팅방에서 본인이 직접 이미지 기반의 커스텀 이모지를 등록하고 사용할 수 있습니다
- 앨범 스트리밍을 하면서 가장 좋은 노래에 유저들이 실시간으로 투표를 진행할 수 있습니다

![스트리밍 페이지](https://github.com/user-attachments/assets/ab132c48-26b4-4d69-8be0-3e045d2a2688)

## ✨ 문제 해결 - 채팅방에서 소통

### [1️⃣ Socket.io 최(강)적화](<https://github.com/boostcampwm-2024/web18-inear/wiki/%F0%9F%9A%80-Socket.io-%EC%B5%9C(%EA%B0%95)%EC%A0%81%ED%99%94>)

소통에서의 가장 중요한 부분은 역시 실시간이었습니다.

각 라이브 세션 안에서 유저들끼리 빠른 응답과 낮은 지연 시간으로 채팅과 투표 기능을 서비스해야했고,

이를 위해 여러 기능들이 지원되는 SocketIO를 채택했습니다.

## 서비스 아키텍처

![image](https://github.com/user-attachments/assets/d829fa2f-b422-48e6-acf7-3c229a6091e6)

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
