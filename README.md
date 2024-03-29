# [Carryduo][Carryduo-link]

[Carryduo-link]: https://www.carryduo.site

#### 리그 오브 레전드 챔피언 데이터 서칭 플랫폼

---

## 프로젝트 소개

### 🚀 기능
<details>

#### 최신 버전의 리그오브레전드 챔피언 데이터 제공

- 게임 플레이에 유용한 챔피언의 상세정보(승률/벤율/포지션별 픽률/스펠 통계)를 최신 버전을 기준으로 제공합니다.

#### 챔피언 듀오 승률 데이터 제공

- 챔피언 듀오 조합에 따른 승률과 티어를 최신 버전을 기준으로 제공하여 특정 챔피언과 시너지 좋은 챔피언을 빠르게 찾을 수 있습니다.  

#### 소환사 전적 검색

- 소환사를 검색하면 해당 소환사의 기본 정보 및 최근 플레이한 10경기에 대한 종합 데이터를 제공합니다.

#### 챔피언/소환사 평판 및 신고

- 챔피언/소환사에 대한 평판 게시판을 제공하고 불건전한 내용은 신고 기능으로 필터링합니다.

#### 카카오 소셜 로그인 제공

- 카카오를 통한 소셜 로그인으로 간단하고 안전하게 회원가입이 가능합니다.
</details>

### 🛠 Architecture
<details>

![Carryduo BE 서비스 아키텍처](https://user-images.githubusercontent.com/49478770/220548692-6c2c35b7-8cd5-4021-8b0c-1fa6220d1485.png)

</details>

### 📈 ERD
<details>

![Carryduo 서비스 ERD](https://user-images.githubusercontent.com/91710667/202378401-9a983754-d8f1-4f41-8d8b-d79e62d2b283.png)

</details>

### 🚀 데이터분석 프로세스

[상세설명 노션 링크][notionLink]

[notionLink]: https://frequent-hovercraft-885.notion.site/Carryduo-7a9e5f584620444986ee950bd309b524

## 🛠 Tools
<details>

#### Language



![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

#### Framework


![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=NestJs&logoColor=white)

#### Infrastructure


![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Amazon EC2](https://img.shields.io/badge/Amazon%20EC2-FF9900.svg?style=for-the-badge&logo=Amazon%20EC2&logoColor=white)

#### Dataase

![RDS](https://img.shields.io/badge/Amazon%20RDS-527FFF?style=for-the-badge&logo=Amazon%20RDS&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

#### Dev tools


<img src="https://img.shields.io/badge/github-181717.svg?style=for-the-badge&logo=github&logoColor=white">

#### Library
| Name                | Appliance               | Version  |
| :-----------------: | :---------------------: | :------: |
| cache-manager</br>cache-manager-redis-store   | 캐시 관리</br>캐시 저장소 레디스 사용  |4.1.0</br>2.0.0|
| class-transformer   | 객체 변환              |0.5.1|
| class-validator     | 유효성 검사            |0.13.2|
| mysql2              | mysql 드라이버         |2.3.3|
| @nestjs/typeorm</br>typeorm  | mySQL ORM             |9.0.1</br>0.3.9|
| @nestjs/swagger     | API 문서화            |6.1.2|
| express-basic-auth  | swagger 보안 설정      |1.2.1|
| axios               |  API 통신(RIOT API)     |0.27.2|
| @nestjs/passport</br>passport-kakao      | 카카오 소셜 로그인      |9.0.0</br>1.0.1|
| passport-jwt        | JWT토큰 발급            |4.0.0|
| eslint</br>prettier | 소스코드 규격            |8.0.1</br>2.3.2|
| @nestjs/testing</br>jest          |  테스트코드             |9.0.0</br>28.1.3|

<hr>

</details>

## 🔥이슈 및 트러블슈팅

<details>
<summary><b>➡️ Child-Process를 이용한 데이터분석 자동화 개선 </b></summary>
<br/>
  
> **문제** : 기존 데이터 분석은 toad-scheduler 패키지를 이용하여 고정된 시간을 기준으로 데이터 분석이 스케줄링 되었습니다. 예컨대, 1시간마다 데이터 분석 로직을 실행하는 것입니다. 하지만, carryduo에서 관리하는 챔피언 데이터가 많아짐에 따라, 데이터 분석 로직이 스케줄링 기준 시간을 초과하는 문제가 발생했습니다. 예컨대, 첫번째 스케줄이 종료되지 않았는데, 두번째 스케줄이 실행되는 문제가 발생한 것입니다.
>
> **해결** : nodeJS가 제공하는 child-process를 이용하여, 데이터 분석 프로세스를 1) 데이터 분석 프로세스 핸들러, 2) 데이터 분석 프로세스로 분리했습니다. 이를 통해, 데이터 분석 프로세스 종료 시점을 기준으로 다음 분석을 실행하도록 프로세스를 개선했습니다.
<br/> <br/>
> **코드스니펫**<br/>
> [Child-Process를 이용한 데이터 분석 프로세스][CodeSnipet5]
  
  [CodeSnipet5]: https://github.com/Carryduo/Carryduo-DataAnalysis/blob/main/handler.js
</details>

<details>
<summary><b>➡️ AWS S3를 이용한 챔피언 이미지 파일 자체 관리 </b></summary>
  <br/>
  
  
> **문제** : 기존에 Carryduo는 라이엇에서 제공하는 이미지 URL을 그대로 활용했습니다. 이는 이미지 파일과 관련하여 라이엇 서버에 대한 의존성이 매우 높다는 문제가 존재합니다. 예컨대, 라이엇 서버가 다운되면, Carryduo에서 이미지를 제공할 수 없는 것입니다.
>
> **해결** : 라이엇에서 제공하는 이미지 데이터를 arrayBuffer 타입, image/jpeg|png 형식으로 AWS S3에 저장하여 라이엇 서버에 대한 의존성을 낮췄습니다. 이미지 데이터는 리그오브레전드 패치버전에 대응하여 업데이트 되도록 하였습니다.
</details>

<details>
<summary><b>➡️ 리그오브레전드 패치버전 업데이트에 대응한 데이터 관리 </b></summary>
<br/>
  
> **문제1** : 리그오브레전드에 새로운 패치버전이 업데이트 되면, 이전 패치버전의 챔피언 데이터는 사용자에게 무용한 데이터가 됩니다. 기존 데이터 분석 프로젝트에서는 패치버전을 고려하지 않아, outdated한 표본이 데이터에 지속적으로 쌓여, 데이터의 유의미성이 저하되는 문제가 있었습니다.
>
> **해결1** : 패치버전에 따라 데이터를 구분해서 수집/분석하도록 데이터 분석 로직을 수정하고, 사용자에게 무용한  패치버전 데이터는 주기적으로 폐기처분하도록 하여, 데이터 최신화와 DB 용량 관리를 동시에 실현했습니다. <br/> <br/>
> **코드스니펫** <br/>
  > [1) Outdated한 데이터 폐기 로직 코드스니펫][CodeSnipet1]

[CodeSnipet1]: https://github.com/Carryduo/Carryduo-DataAnalysis/blob/40bbbeb2dc79e78fd9ab4fa068c1e597a68bc693/analyze/data-retirement/data.retirement.controller.js#L21-L112


> **문제2** : 리그오브레전드에 새로운 패치버전이 업데이트 되었을 시에 패치 초반에는 분석된 데이터의 양이 현저히 적어, 분석이 되지 않은 챔피언의 경우, 분석 데이터 값이 null로 응답되는 문제가 발생했습니다. 데이터 분석용 DB에서 유저에게 데이터를 제공하는 서비스용 DB로 데이터를 이관하는 스케줄이 1시간 30분으로 설정되어있기 때문이었습니다.
>
> **해결2** : 1) 최신 패치버전에 대응한 챔피언 데이터가 없는 경우, 이전 패치버전을 response하도록 로직을 개선했습니다. 2)transferStatus라는 데이터 이관 주기 상태값을 데이터 분석 스케줄러에 적용하여, 데이터 이관 주기를 기존 1시간 30분에서 12시간으로 변경하여, 새로운 패치 초반 단계에서 특정 챔피언에 대한 response 값이 null로 뜨는 현상을 방지하였습니다. <br/> <br/>
> **코드스니펫**<br/>
> [1) 데이터가 없는 경우, 이전 패치버전 response 적용 코드스니펫][CodeSnipet2] <br/>
> [2) 스케줄러에 transferStatus 적용 코드스니펫][CodeSnipet3]

[CodeSnipet2]: https://github.com/Carryduo/Carryduo-TEAM-BE/blob/cf32a5f4440151a273421f314a7e206d77669d26/src/combination-stat/combination-stat.service.ts#L62-L75
[CodeSnipet3]: https://github.com/Carryduo/Carryduo-DataAnalysis/blob/40bbbeb2dc79e78fd9ab4fa068c1e597a68bc693/task/task.js#L37-L77
  
</details>

<details>
<summary><b>➡️ service <-> repository 계층 간 명확한 책임 분리 </b></summary>
<br/>


> **문제** : 이전 개선 사항에서 service에 Brackets를 주입하였습니다. 하지만 Brackets는 select 쿼리 시 조건문을 생성하는 용도로 활용되고 있는 객체임에도 불구하고, service에서 직접적으로 주입되어 사용되고 있는 것은 "비즈니스 로직"만 담당한다는 service의 역할을 초과하는 일이라 판단했습니다.
>
> **해결** : 쿼리를 전적으로 담당하는 계층은 repository이므로, Brackets를 생성하는 책임은 repository로 위임했습니다. service에서는 Brackets 생성을 위해 필요한 매개변수를 repository에 전달하고, Brackets 객체를 반환받습니다.
<br/> <br/>
>
> **코드스니펫**<br/>
> - [1)service 계층][CodeSnipet6]
> - [2)repository 계층][CodeSnipet7]
  
  [CodeSnipet6]: https://github.com/Carryduo/Carryduo-TEAM-BE/blob/e52062ef4b2a0517568adc2b1c03005fcf0cdc8f/src/combination-stat/combination-stat.service.ts#L50
  [CodeSnipet7]: https://github.com/Carryduo/Carryduo-TEAM-BE/blob/e52062ef4b2a0517568adc2b1c03005fcf0cdc8f/src/combination-stat/combination-stat.repository.ts#L125-L206
<details>
<summary>이전 개선 사항</summary>

> **문제** : 프로젝트는 3-Layered-Architecture 구조에 입각하여 작성되었습니다. 프로젝트의 기능 중 request 값에 따라 쿼리문의 where문을 변경해주어야 하는 로직이 있었습니다. 기존에는 이를 DB 쿼리를 관리하는 repository 계층에서 분기 처리를 해주었습니다. 이에 따라, 순수한 DB 쿼리만을 관리한다는 repositroy 계층이 비즈니스 로직을 관리하는  service 계층의 책임까지  분담하는 구조적 문제가 발생했습니다.
>
> **해결** : switch-case 문을 활용하여, serivce에서 controller부터 받은 request 값에 따라 쿼리 where문을 사전에 분기처리하여 repository 계층으로 이를 넘기도록 구조를 수정하여 계층 간 책임 분리를 공고화하였습니다. <br/> <br/>
>
> **코드스니펫**<br/>
> [1)switch-case문 활용 코드스니펫][CodeSnipet4]
  
  [CodeSnipet4]: https://github.com/Carryduo/Carryduo-TEAM-BE/blob/cf32a5f4440151a273421f314a7e206d77669d26/src/combination-stat/combination-stat.service.ts#L119-L194

</details>


</details>

<details>
<summary><b>➡️ 배포 파이프라인 안정화 </b></summary>
  <br/>
  
  
> **문제** : 기존 배포 파이프라인은 CI -> 런타임 환경 배포 -> 빌드 -> 프로젝트 재실행로 구성되어 있었습니다. 이에, 프로젝트 규모가 커짐에 따라서 런타임 환경에서 배포에 대한 부담이 커져, 서버 재실행 시간이 지연되는 문제가 발생했습니다.
>
> **해결** : AWS CodeBuilder를 도입하여, 배포 파이프라인을 CI -> 빌드 -> 런타임 환경 배포 -> 프로젝트 재실행의 순서로 수정하여, 빌드/배포 환경을 안정화하였습니다.
</details>
