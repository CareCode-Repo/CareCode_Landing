# CareCode Landing

맘편한(CareCode) 서비스 소개 사이트입니다. 앱([CareCode_FE](https://github.com/CareCode-Repo/CareCode_FE))과
API([CareCode_Interface](https://github.com/CareCode-Repo/CareCode_Interface))와는 **별개로 배포**합니다.

## 왜 별도 프로젝트인가

앱은 로그인한 사용자가 쓰는 모바일 화면이고, 이 사이트는 아직 가입하지 않은 사람이 보는
데스크톱 중심 문서입니다. 레이아웃도 배포 주기도 다릅니다.

앱 안에 두면 소개 문구 한 줄 고치는 데 앱 전체를 다시 배포해야 하고, 앱의 모바일 셸과
세션·푸시 초기화를 경로마다 우회해야 합니다.

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # out/ 에 정적 파일 생성
```

서버가 할 일이 없어 `output: 'export'` 로 정적 출력만 만듭니다.

## 스택

Next.js 15 (App Router, 정적 출력) · React 19 · Tailwind CSS v4 · TypeScript
