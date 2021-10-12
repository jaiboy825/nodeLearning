# 노드공부인것이다.

## node 핵심 개념
### 서버
서버는 네트워크를 통해 클라이언트에 정보나 서비스를 제공하는 컴퓨터 또는 프로그램을 말한다. 클라이언트란 요청을 보내는 주체로 브라우저나 데스크톱 프로그램일 수도 있고, 모바일 앱이나 다른 서버에 요청을 보내는 서버일 수도 있다.

웹이나 앱을 사용할 때 사람의 데이터와 서비스의 데이터가 생성된다. 이 데이터를 어딘가에 저장하고, 그 어딘가에서 클라이언트로 데이터를 받아와야 하는데 이곳이 바로 서버이다.

서버라고 해서 요청에 대한 응답만 하는 것은 아니다. 다른 서버에 요청을 보낼 수도 있다. 이떄는 요청을 보낸 서버가 클라이언트 역할을 한다.

정리하자면, 서버는 클라이언트의 요청에 대해 응답을 하고, 응답으로는 항상 yes를 해야하는 것은 아니다. no를 할 수 있다.

### 런타임
노드는 자바스크립트 런타임이다. 여기서 런타임은 특정 언어로 만든 프로그램들을 실행할 수 있는 환경을 뜻한다.
따라서 노드는 자바스크립트 프로그램을 컴퓨터에서 실행할 수 있다. 쉽게 말해 노드는 자바스크립트 실행기라고 봐도 무방하다.

## 이 문서를 읽고 있다면, 자바스크립트 문법을 기본적으로 알고있다는 조건하에 시작해야 한다.

### 이벤트 기반
이벤트 기반이란 이벤트가 발생할 때 미리 지정해둔 작업을 수행하는 방식을 의미한다.

이벤트 기반 시스템에서는 특정 이벤트가 발생할 때 무엇을 할지 미리 등록해두어야 한다. 이를 이벤트 리스너에 콜백 함수를 등록한다고 표현한다.
노드도 이벤트 기반 방식으로 동작하므로, 이벤트가 발생하면 이벤트 리스너에 등록해둔 콜백 함수를 호출한다. 발생한 이벤트가 없거나 발생했던 이벤트를 다 처리하면, 노드는 다음 이벤트가 발생할 때까지 대기한다.

이벤트 기반 모델에서는 이벤트 루프라는 개념이 등장한다. 여러 이벤트가 동시에 발생했을 때 어떤 순서로 콜백 함수를 호출할지를 이벤트 루프가 판단한다.


노드는 자바스크립트 코드의 맨 위부터 한 줄씩 실행한다. 함수 호출 부분을 발견했다면 호출한 함수를 호출 스택에 넣는다.
```js
function first() {
    second();
    console.log('첫 번째')
}
function second() {
    third();
    console.log('두 번째');
}
function third() {
    console.log('세 번째')
}

first();
```

이 코드에서는 first 함수가 제일 먼저 호출되고, 그 안의 second, third 함수가 순차적으로 호출된다. 실행은 호출된 순서와 반대로 실행이 완료 된다. 따라서 세 번째, 두 번째, 첫 번째 순서로 찍히게 된다.

#### 이벤트 루프 
이벤트 발생 시 호출할 콜백 함수들을 관리하고, 호출된 콜백 함수의 실행 순서를 결정하는 역할을 담당한다. 노드가 종료될 때까지 이벤트 처리를 위한 작업을 반복하므로 루프라고 부른다.

#### 백그라운드 
setTimeout 같은 타이머나 이벤트 리스너들이 대기하는 곳이다. 자바스크립트가 아닌 다른 언어로 작성된 프로그램이라고 봐도 된다. 여러 작업이 동시에 실행될 수 있다.

#### 태스크 큐
이벤트 발생 후, 백그라운드에서는 태스크 큐로 타이머나 이벤트 리스너의 콜백 함수를 보낸다. 정해진 순서대로 콜백들이 줄을 서 있으므로 콜백 큐라고도 부른다. 콜백들은 보통 완료된 순서대로 줄을 서 있지만 특정한 경우에는 순서가 바뀌기도 한다.

#### setTimeout 코드 실행 내부 과정
먼저 전역 컨텍스트인 anonymous가 호출 스택에 들어간다. 그 뒤 setTimeout이 호출 스택에 들어간다.

호출 스택에 들어간 순서와 반대로 실행되므로, setTimeout이 먼저 실행된다. setTimeout이 실행되면 타이머와 함께 run 콜백을 백그라운드로 보내고, setTimeout은 호출 스택에서 빠진다.
그 다음으로 anonymous가 호출 스택에서 빠진다. 백그라운드에서는 3초를 센 후 run 함수를 태스크 큐로 보낸다. 3초를 세었다는 것은 백그라운드에 맡겨진 작업이 완료된 것으로 이해해도 된다.

호출 스택에서 anonymous까지 실행이 완료되어 호출 스택이 비어 있는 상황에서 이벤트 루프는 호출 스택이 비어 있으면 태스크 큐에서 함수를 하나씩 가져와 호출 스택에 넣고 실행한다.

이벤트 루프가 run 콜백을 대스크 큐에서 꺼내 호출 스택으로 올린 상황에서 올려진 run은 실행되고, 실행 완료 후 호출 스택에서 비워진다. 이벤트 루프는 태스크 큐에 콜백 함수가 들어올 때까지 계속 대기한다.

만약 호출 스택에 함수들이 너무 많이 들어 있으면 3초가 지난 후에도 run 함수가 실행되지 않을 수 있다. 이벤트 루프는 호출 스택이 비어 있을 때만 태스크 큐에 있는 run 함수를 호출 스택으로 가져오니 setTimeout의 시간이 정확하지 않을 수도 있다.

### 논 블로킹 I/O
이벤트 루프를 잘 활용하면 오래 걸리는 작업을 효율적으로 처리할 수 있다. 작업에는 두 가지 종류가 있는데, 동시에 실행될 수 있는 작업과 동시에 실행될 수 없는 작업이다.

I/O는 입력/출력을 의미한다. 파일 시스템 접근이나 네트워크를 통한 요청 같은 작업이 I/O의 일종이다. 이러한 작업을 할 때 노드는 논 블로킹 방식으로 처리하는 방법을 제공한다. 논 블로킹이란 이전 작업이 완료될 때까지 대기하지 않고 다음 작업을 수행함을 뜻한다. 반대로 블로킹은 이전 작업이 끝나야만 다음 작업을 수행하는 것을 의미한다.

따라서 블로킹 방식보다 논 블로킹 방식이 같은 작업을 더 짧은 시간에 처리할 수 있음을 알 수 있다만 작업들이 모두 동시에 처리될 수 있는 작업이라는 전제가 있다.

노드는 I/O 작업을 백그라운드로 넘겨 동시에 처리하곤 한다. 따라서 동시에 처리될 수 있는 작업들은 최대한 묶어서 백그라운드로 넘겨야 시간을 절약할 수 있다.

그렇다고 I/O 작업이 없다고 해서 논 블로킹이 의미가 없는 것은 아니다. 오래 걸리는 작업을 처리해야 하는 경우, 논 블로킹을 통해 실행 순서를 바꿔줌으로써 그 작업 때문에 간단한 작업들이 대기하는 상황을 막을 수 있다는 점에서 의의가 있다. 또한, 논 블로킹과 동시가 같은 의미가 아니라는 것도 알아둬야한다. 동시성은 동시 처리가 가능한 작업을 논 블로킹 처리해야 얻을 수 있다.

### 싱글 스레드
이벤트 기반, 논 블로킹 모델과 더불어 노드를 설명할 때 자주 나오는 용어가 하나 더 있다. 그것은 싱글 스레드 이다. 

싱글 스레드란 스레드가 하나뿐이라는 것을 의미한다. 스레드를 이해하기 위해서는 프로세스 부터 알아야 한다. 

프로세스는 운영체제에서 할당하는 작업의 단위이다. 노드나 웹 브라우저 같은 프로그램은 개별적인 프로세스이다. 프로세스 간에는 메모리 등의 자원을 공유하지 않는다.

스레드는 프로세스 내에서 실행되는 흐름의 단위이다. 프로세스는 스레드를 여러 개 생성해 여러 작업을 동시에 처리할 수 있다. 스레드들은 부모 프로세스의 자원을 공유한다. 같은 주소의 메모리에 접근 가능하므로 데이터를 공유할 수 있다.

노드는 싱글 스레드로 동작하지 않는다. 노드를 실행하면 먼저 프로세스가 하나 생성된다. 그리고 그 프로세스에서 스레드들을 생성하는데, 이때 내부적으로 스레드를 여러 개 생성한다. 그 중에서 우리가 제어할 수 있는 스레드는 하나뿐이여서 흔히 노드가 싱글 스레드라고 여겨지는 것이다. 요청이 많이 들어오면 한 번에 하나씩 요청을 처리한다. 

이렇게 설명하면은 멀티 스레드가 싱글 스레드보다 좋아보인다. 하지만 꼭 그런 것은 아니다. 이해를 돕기 위한 예시로 (교재상)
```
한 음식점에 점원이 한 명이 있습니다. 손님은 여러 명이고요, 점원 한 명이 줍문을 받아 주방에 넘기고, 주방에서 요리가 나오면 손님에게 서빙을 합니다. 그 후 다음 손님의 주문을 받습니다. 이런 구조라면 다음 손님은 이전 손님의 요리가 나올 때까지 아무것도 못 하고 기다려야 합니다. 이것이 바로 싱글 스레드, 블로킹 모델입니다. 매우 비효율적입니다.
```
```
이번에는 점원이 한 손님의 주문을 받고, 주방에 주문 내역을 넘긴 뒤 다음 손님의 주문을 받습니다. 요리가 끝나기까지 기다리는 대신, 주문이 들어왔다는 사실만 주방에 계속 알려주는 것입니다. 주방에서 요리가 완료되면 완료된 순서대로 손님에게 서빙합니다. 요리의 특성에 따라 완료되는 순서가 다를 수 있으므로, 주문이 들어온 순서와 서빙하는 순서는 일치하지 않을 수도 있습니다. 이것이 싱글스레드, 논 블로킹 모델입니다. 바로 노드가 채택하고 있는 방식입니다. 점원은 한 명이지만 혼자서 많은 일을 처리할 수 있습니다.
```
```
이번에는 멀티 스레드 방식 , 멀티 스레드 방식에서는 손님 한 명이 올 때마다 점원도 한 명씩 붙어 주문을 받고 서빙합니다. 언뜻 보면 싱글 스레드보다 좋은 방법인 것 같지만, 장단점이 있습니다. 일단 손님 한 명당 점원도 한 명이면 서빙 자체는 걱정이 없습니다. 점원 한 명에게 문제가 생겨도 다른 점원으로 대체하면 되기 때문입니다. 하지만 손님의 수가 늘어날수록 점원의 수도 늘어납니다. 손님 수가 줄어들었을 때 일을 하지 않고 노는 점원이 있다는 것도 문제가 됩니다. 점원을 새로 고용하거나 기존 점원을 해고하는 데는 비용이 발생합니다. 그렇다면 점원 여러 명이 모두 논 블로킹 방식으로 주문을 받으면 더 좋지 않을까 하는 의문이 들 수 있다. 실제로 그렇습니다만 멀티 스레드 방식으로 프로그래밍하는 것은 상당히 어려우므로 멀티 프로세싱 방식을 대신 사용합니다. I/O 요청에는 멀티 프로세싱이 더 효율적이기도 합니다.
```
I/O 작업을 처리할 때는 멀티 스레딩보다 멀티 프로세싱이 효율적이므로 노드는 멀티 프로세싱을 많이 합니다.

<hr>

## 서버로서의 노드
(교재의 내용)

노드는 기본적으로 싱글 스레드, 논 블로킹 모델을 사용하므로, 노드 서버 또한 동일한 모델일 수밖에 없습니다. 따라서 노드 서버의 장단점은 싱글스레드, 논 블로킹 모델의 장단점과 크게 다르지 않습니다.

서버에는 기본적으로 I/O 요청이 많이 발생하므로, I/O 처리를 잘하는 노드를 서버로 사용하면 좋습니다. 노드는 libuv 라이브러리를 사용하여 I/O 작업을 논 블로킹 방식으로 처리합니다. 따라서 스레드 하나가 많은 수의 I/O를 혼자서도 감당할 수 있습니다.하지만 노드는 CPU 부하가 큰 작업에는 적합하지 않습니다. 코드가 CPU 연산을 많이 요구하면 스레드 하나가 혼자서 감당하기 어렵습니다.

이와 같은 특성을 활용하려면 개수는 많지만 크기는 작은 데이터를 실시간으로 주고받는데 적합합니다. 네트워크나 데이터베이스, 디스크 작업 같은 I/O 에 특화되어 있기 때문입니다. 실시간 채팅 어플리케이션이나 주식 차트, JSON 데이터를 제공하는 API 서버가 노드를 많이 사용합니다.

멀티 스레드 기능이 있다고 하더라도 이미지나 비디오 처리, 혹은 대규모 데이터 처리처럼 CPU를 많이 사용하는 작업을 위한 서버로는 권장하지 않습니다. 노드보다 더 적합한 다른 언어 서버가 많습니다.

노드에는 웹 서버가 내장되어 있어 입문자가 쉽게 접근할 수 있습니다. 내장 서버를 사용하면 편리하지만 나중에 서버 규모가 커지면 nginx 등의 웹 서버를 사용해야 합니다

<hr>

노드의 가장 큰 장점으로는 언어로 자바스크립트를 사용한다는 것이다. 웹 브라우저도 자바스크립트를 사용하므로 서버까지 노드를 사용하면 하나의 언어로 웹 사이트를 개발할 수 있다. 이로써 개발 생산성을 획기적으로 높였고, 생산성이 중요한 기업이 노드를 채택하는 이유가 되었다.

그리고 요즘은 xml 대신 json을 사용해서 데이터를 주고받는데, json이 자바스크립트 형식이므로 노드에서는 쉽게 처리할 수 있다.

<hr>

## 서버 외의 노드
(교재 내용)
처음에는 노드를 대부분 서버로 사용했지만, 노드는 자바스크립트 런타임이므로 용도가 서버에만 한정되지 않습니다. 사용 범위가 점점 늘어나서 노드는 웹, 모바일, 데스크톱 애플리케이션 개발에도 사용되기 시작했습니다.

노드 기반으로 돌아가는 대표적인 웹 프레임워크로는 앵귤로, 리액트, 뷰 등이 있습니다. 모바일 개발 도구로는 리액트 네이티브를 많이 사용합니다. 데스크톱 개발 도구로는 일렉트론이 대표적입니다.
- 일렉트론으로 만들어진 애플리케이션 중 에서는 디스코드를 많이 사용해보았고, 현재 회사에서 slack 도 사용 중 이다.

## 개발 환경 설정하기

### node 설치

1. 먼저 노드를 설치해야 한다. https://nodejs.org 노드 홈페이지에서 자신의 컴퓨터에 맞는 버전을 다운받아서 설치한다.
2. 노드 설치 확인은 터미널 혹은 cmd 창에서 node -v라고 치면 나온다.

### npm 버전 업데이트 하기
```
npm install -g npm
```

### vs code 설치
1. https://code.visualstudio.com/ Visual Studio Code 홈페이지에서 자신의 컴퓨터에 맞는 버전을 다운받아서 설치한다.
2. 설치한 vs code를 실행한다.

<hr>

## 자바스크립트

let,var,const 나 class 아니면 화살표 함수같은 경우 이미 알고 있어야 이후에 나올 내용들을 이해할 수 있기에 생략하고 프로미스, async/await 등 심화 내용을 다루도록 하겠다.

### 프로미스 
자바스크립트와 노드에서는 주로 비동기를 접한다. 특히 이벤트 리스너를 사용할 때 콜백 함수를 자주 사용한다.

```js
const condition = ture; // true면 resolve, false면 reject
const promise = new Promise((resolve, reject) => {
    if (condition){
        resolve('성공')
    } else {
        reject('실패')
    }
})
//다른 코드가 들어갈 수 있음 , 코드는 node js 교과서 교재의 내용]
promise.then((message) => {
    console.log(message)
})
.catch((error) => {
    console.log(error)
})
.finally(() => {
    console.log('무조건')
})

```

new Promise로 프로미스를 생성할 수 있으며, 그 내부에 resolve와 reject를 매개변수로 갖는 콜백 함수를 넣는다. 
이렇게 만든 promise 변수에 then과 catch 메서드를 붙일 수 있다. 프로미스 내부에서 resolve가 호출되면 then이 실행되고, reject가 호출되면 catch가 실행된다. finally 부분은 성공/실패 여부와 상관없이 실행된다.
resolve와 reject에 넣어준 인수는 각각 then과 catch의 매개변수에서 받을 수 있다.

프로미스를 쉽게 설명하자면, 실행은 바로 하되 결괏값은 나중에 받는 객체이다. 결괏값은 실행이 완료된 후 then이나 catch 메서드를 통해 받는다.

### async/await
노드 7.6 버전부터 지원되는 기능으로, 노드처럼 비동기 위주로 프로그래밍을 해야할 때 도움이 된다.

프로미스가 콜백 지옥을 해결했지만, 여전히 then과 catch가 계속 반복되어 코드가 많다. async/await 문법은 프로미스를 사용한 코드를 한 번 더 깔끔하게 줄여준다.

예시
```js
function findAndSaveUser(users) {
    Users.findOne({})
    .then((user) => {
        user.name = 'zero';
        return user.save();
    })
    .then((user) => {
        return users.findOne({gender:'m'});
    })
    .catch(err => {
        console.error(err)
    })
}
```

이것을 async/await를 사용하면

```js
async function findAndSaveUser(users) {
    let user = await Users.findOne({});
    user.name = 'zero',
    user = await user.save();
    user = await users.findOne({gender : 'm'})
}
```

이런식으로 코드를 줄일 수 있다. 하지만 위 코드는 에러를 처리하는 부분이 없으므로 추가 작업이 필요하다.

```js
async function findAndSaveUser(users) {
    try{
        let user = await Users.findOne({});
        user.name = 'zero',
        user = await user.save();
        user = await users.findOne({gender : 'm'})
    } catch (error) {
        console.log(error)
    }
}
```
이렇게 try/catch 문으로 로직을 감쌌다. 프로미스의 catch 메서드처럼 try/catch 문의 catch 가 에러를 처리한다.

- 화살표 함수도 사용할 수 있다.

for 문과 async/await을 같이 써서 프로미스를 순차적으로 실행할 수 있다. for문과 함께 쓰는 것은 노드 10 버전부터 지원하는 문법이다.

```js
const promise1 = Promise.resolve('성공1');
const promise2 = Promise.resolve('성공2');
(async () => {
    for await (promise of [promise1, promise2]) {
        console.log(promise);
    }
})();
```
위 코드는 for await of 문을 사용해서 프로미스 배열을 순회하는 것이다. async 함수의 반환값은 항상 Promise로 감싸진다. 따라서 실행 후 then을 붙이거나 또 다른 async 함수안에서 await을 붙여서 처리할 수 있다.

```js
async function other() {
    const result = await findAndSaveUser();
}
```

## 프론트엔드 자바스크립트

### AJAX
ajax (asynchronous Javascript and xml) 는 비동기적 웹 서비스를 개발할 때 사용하는 기업이다.
이름에 xml이 들어 있지만 꼭 xml을 사용해야 하는 것은 아니며, 요즘에는 json을 많이 사용한다.

이걸 쉽게 설명하면 페이지 이동 없이 서버에 요청을 보내고 응답을 받는 기술이다.

보통 ajax 요청은 jquery 나 axios 같은 라이브러리를 이용해서 보낸다. 
```js
axios.get('요청을 보낼 주소')
.then((result) => {
    console.log(result);
    console.log(result.data);
})
.catch((error) => {
    console.error(error);
})
```

axios.get도 내부에 new Promise가 들어 있으므로 then과 catch를 사용할 수 있다. result.data에는 서버로부터 보낸 데이터가 들어 있다. 

프로미스이므로 async/await 방식으로 변경할 수 있다. 익명 함수라서 즉시 실행을 위해 코드를 소괄호로 감싸서 호출해보도록 하겠다.

```js
(async () => {
    try {
        const result = await axios.get('주소');
        console.log(result);
        console.log(result.data)
    } catch (error) {
        console.error(error);
    }
})()
```

이번에는 post 방식의 요청을 보내겠다.

```js
(async () => {
    try {
        const result = await axios.post('주소', {
            name: '이름',
            birth : 2003
        });
        console.log(result);
        console.log(result.data);
    } catch (error) {
        console.error(error);
    }
})();
```
위 코드는 전체적인 구조는 비슷한데 두 번째 인수로 데이터를 넣어 보내는 것이 다르다. GET 요청이면 axios.get을 POST 요청이면 axios.post를 사용한다.

### FormData
HTML form 태그의 데이터를 동적으로 제어할 수 있는 기능이다. 주로 ajax와 함께 사용된다.
먼저 FormData 생성자로 formData 객체를 만든다. 

```js
const formData = new FormData();
formData.append('test', ['name','test'])
```

생성된 객체의 append 메서드로 키-값 형식의 데이터를 저장할 수 있다. 
- append 메서드를 여러 번 사용해서 키 하나에 여러 개의 값을 추가해도 된다.
- has 주어진 키에 해당하는 값이 있는지 여부를 알린다. 
- get 메서드는 주어진 키에 해당하는 값 하나를 가져온다.
- getAll 메서드는 해당하는 모든 값을 가져온다.
- delete 메서드는 현재 키를 제거한다.
- set은 현재 키를 수정한다

### encodeURIComponent, decodeURIComponent
서버 종류에 따라 다르지만 주소에 한글이 들어갔을 때 한글 주소를 이해하지 못하는 경우가 있는데, 이럴 때는 window 객체의 메서드인 encodeURIComponent 메서드를 사용한다.

```js
(async () => {
    try {
        const result = await axios.get(`https://test.test/${encodeURIComponent('노드')}`);
        console.log(result);
        console.log(result.data)
    } catch (error) {
        console.error(error);
    }
})()
```

이렇게 되면 노드라는 글짜가 특수한 문자열로 변환되는데 이것을 받는 쪽에서는 decodeURIComponent를 사용하면 된다.

### 데이터 속성과 dataset
이 부분의 경우에는 dom 객체 생성을 공부하다 보면 알기 때문에 굳이 따로 설명할 필요는 없어서 생략한다.

<hr>

## 노드 기능

### REPL
자바스크립트는 스크립트 언어이므로 미리 컴파일을 하지 않아도 즉석에서 코드를 실행할 수 있다.
브라우저의 콘솔 탭에서 자바스크립트 코드를 빙력할 수 있듯이 노드도 비슷한 콘솔을 제공하는데, 읽고, 해석하고, 결과물을 반환하고, 종료할 때까지 반복한다고 해서 REPL이라고 부른다.

코드 에디터에서 터미널이나 명령 프롬프트를 켜서 node 라고 입력한다
그러면 
```
$ node
> 
```
이런식으로 나오게 되는데 이 때 자바스크립트 코드를 입력할 수 있다.

이것 외에도 js 파일로 작성한 뒤에  node [자바스크립트 파일 경로]로 실행이 가능하다.

### 모듈화
노드는 코드를 모듈로 만들 수 있다는 점에서 브라우저의 자바스크립트와 다르다. 모듈이란 특정한 기능을 하는 함수나 변수들의 집합이다.

모듈로 만들어두면 여러 프로그램에 해당 모듈을 재사용할 수 있다. 자바 스크립트에서 코드를 재사용하기 위해 함수로 만드는 것과 비슷하다.

보통 파일 하나가 모듈 하나가 된다. 파일별로 코드를 모듈화할 수 있어 관리하기 편하다.

var.js, func.js, index.js 이 세가지 파일들을 같은 폴더에 만든다.

var.js
```js
const odd = '홀수입니다';
const even = '짝수입니다';

module.exports = {
    odd,
    even
};
```

이렇게 선언된 var.js 를 참조하는 func.js는
```js
const {odd, even} = require('./var');

function checkOddOrEven(num) {
    if (num % 2) {
        return odd;
    }
    return even;
}

module.exports = checkOddOrEven;
```

require 함수 안에 불러올 모듈의 경로를 적는다. 파일 경로에서는 js나 json 같은 확장자는 생략할 수 있다.

index.js
```js
const {odd,even} = require('./var');
const checkNumber = require('./func');

function checkStringOddOrEven (str) {
    if (str.length % 2) {
        return odd;
    }
    return even;
}

console.log(checkNumber(10));
console.log(checkStringOddOrEven('hello'))

```

이렇게 작성된 index.js를 실행해보면
```
$ node index
짝수입니다
홀수입니다
```

이러한 결과가 나온다. 따라서 여러파일에 걸쳐 재사용되는 함수나 변수를 모듈로 만들어두면 편리하다.

<hr>

## 노드 내장 객체

### global 
먼저 global 객체이다. 브라우저의 window 와 같은 전역 객체이다. 전역 객체이므로 모든 파일에서 접근할 수 있다. 또한 window.open 메서드를 그냥 open으로 호출할 수 있는 것처럼 global도 생략할 수 있다. 

### console
이 문서를 작성하면서, 이전에 프로젝트를 만들면서 사용했던 console도 노드에서는 window 대신 global 객체 안에 들어 있으며, 브라우저에서의 console과 거의 비슷하다.

console 객체는 보통 디버깅을 위해 사용한다. 개발하면서 변수에 값이 제대로 들어 있는지 확인하기 위해 사용하고, 에러 발생 시 에러 내용을 콘솔에 표시하기 위해 사용하며, 코드 실행 시간을 알아보려고 할 때도 사용한다. 대표적으로 console.log 메서드가 있다.

### 타이머
타이머 기능을 제공하는 함수인 setTimeout, setInterval, setImmediate는 노드에서 window 대신 global 객체 안에 들어 있다. setTimeout과 setInterval은 웹 브라우저에서도 자주 사용되므로 익숙할 것이다.

### __filename, __dirname
노드에서는 파일 사이에 모듈 관계가 있는 경우가 많으므로 때로는 현재 파일의 경로나 파일 명을 알아야 한다. 노드는 __filename, __dirname 이라는 키워드로 경로에 대한 정보를 제공한다.

파일에 __filename과 __dirname을 넣어두면 실행 시 현재 파일명과 현재 파일 경로로 바뀐다.

경로는 사람마다의 경로가 다르기 때문에 /나 \같은 경로 구분자 문제도 있으므로 보통은 이를 해결해주는 path모듈과 함꼐 사용한다.

### module, exports, require
위의 코드들에서는 module.exports만 사용했는데, module 객체 말고 exports 객체로도 모듈을 만들 수 있다.
아까 작성했던 var.js를 이렇게 수정해본다.
```js
exports.odd = '홀수입니다';
exports.even = '짝수입니다';
```
이렇게 작성해도 index.js에서는 동일하게 불러올 수 있다.

module.exports로 한 번에 대입하는 대신, 각각의 변수를 exports 객체에 하나씩 넣었다. 동일하게 동작하는 이유는 module.exports와 exports가 같은 객체를 참조하기 때문이다.

모듈을 불러오는 require는 함수이고, 함수는 객체이므로 몇가지 속성을 가지고 있다.

한 번 require 한 파일은 require.cache에 저장되므로 다음 번 require 할 때는 새로 불러오지 않고 require.cache에 있는 것이 재사용 된다.

만약 새로 require 하기를 원한다면, require.cache의 속성을 제거하면 된다. 다만 꼬일 수 있기에 권장하지 않는다.

require.main은 노드 실행 시 첫 모듈을 가리킨다.require.main 객체의 모양은 require.cache의 모듈 객체와 같다

### process 
process 객체는 현재 실행되고 있는 노드 프로세스에 대한 정보를 담고 있다. 

- process.version : 설치된 노드의 버전
- process.arch : 프로세서 아키텍처 정보
- process.platform : 운영체제 플랫폼 정보
- process.pid : 현재 프로세스의 아이디
- process.uptime() : 프로세스가 시작된 후 흐른 시간
- process.execPath : 노드의 경로
- process.cwd() : 현재 프로세스가 실행되는 위치
- process.cpuUsage() : 현재 cpu 사용량

#### process.env
REPL에 process.env를 입력하면 많은 정보들이 출력된다. 자세히 보면 시스템의 환경 변수임을 알 수 있는데 시스템 환경 변수는 노드에 직접 영향을 미치기도 한다. 대표적인 것으로 UV_THREADPOOL_SIZE 와 NODE_OPTIONS 가 있다.  

```R
NODE_OPTIONS=--max-old-spae-size=8192
UV_THREADPOOL_SIZE-8
```

왼쪽이 환경 변수의 이름이고 오른쪽이 값이다.

process.env는 서비스의 중요한 키를 저장하는 공간으로도 사용되기에 서버나 데이터베이스의 비밀번호와 각종 API 키를 코드에 직접 입력하는 것은 위험하다. 따라서 중요한 비밀번호는 process.env의 속성에
```js
const secretId = process.env.SECRET_ID;
const secretCode = process.env.SECRET_CODE
```

#### process.exit()
실행 중인 노드 프로세스를 종료한다. 서버 환경에서 이 함수를 사용하면 서버가 멈추므로 특수한 경우를 제외하고는 서버에서 잘 사용하지 않는다. 하지만 서버 외의 독립적인 프로그램에서는 수동으로 노드를 멈추기 위해 사용한다.

<hr>

## 노드 내장 모듈

(교재 상) 노드의 모듈은 노드 버전마다 차이가 있습니다. 따라서 버전과 상관없이 안정적이고 유용한 기능을 지닌 모듈 위주로 설명하겠습니다. 공식 문서에 모두 나와 있는 내용이지만 중요하고 자주 사용하는 것들만 추렸습니다.

### os
웹 브라우저에 사용되는 자바스크립트는 운영체제의 정보를 가져올 수 없지만, 노드는 os 모듈에 정보가 담겨 있어 정보를 가져올 수 있다.

- os.arch() : process.arch와 동일
- os.platform() : process.platform과 동일
- os.type() : 운영체제의 종류를 보여줌
- os.uptime() : 운영체제 부팅 이후 흐른 시간을 보여준다.
- os.hostname() : 컴퓨터의 이름을 보여줌
- os.release() : 운영체제의 버전을 보여줌
- os.homedir() : 홈 디렉터리 경로를 보여줌
- os.tmpdir() : 임시 파일 저장 경로를 보여줌
- os.cpus() : 컴퓨터의 코어 정보를 보여줌
- os.freemem() : 사용 가능한 메모리를 보여줌
- os.totalmem() : 전체 메모리 용량을 보여줌

os 모듈은 주로 컴퓨터 내부 자원에 빈번하게 접근하는 경우 사용된다. 즉, 일반적인 웹 서비스를 제작할 때는 사용 빈도가 높지 않다. 하지만 운영체제별로 다른 서비스를 제공하고 싶을 때 os 모듈이 유용할 것이다.
<hr>

### path
폴더와 파일의 경로를 쉽게 조작하도록 도와주는 모듈이다. path 모듈이 필요한 이유 중 하나는 운영체제별로 경로 구분자가 다르기 때문이다. 크게 윈도 타입과 posix 타입으로 구분된다. posix는 유닉스 기반의 운영체제들을 의미하면 맥과 리눅스가 속해있다.

- 윈도우는 \ 가 아닌 / 로 구분
- posix는 /가 아닌 \로 구분

- path.sep : 경로의 구분자, /\
- path.delimiter : 환경 변수의 구분자, ; :
- path.dirname() : 파일이 위치한 폴더 경로를 보여줌
- path.extname() : 파일의 확장자를 보여줌
- path.basname() : 파일의 이름을 표시함, 파일의 이름만 표시하고 싶다면 두 번째 인수로 파일의 확장자를 넣으면 된다.
- path.parse() : 파일의 경로를 root, dir, base, ext, name으로 분리함
- path.format() : path.parse()한 객체를 파일 경로로 합침
- path.normalize() : /나 \를 실수로 여러 번 사용했더나 혼용했을 때 정상적인 경로로 변환함
- path.isAbsolute() : 파일의 경로가 절대경로인지 상대경로인지를 true나 false로 알림
- path.relative() : 경로를 두 개 넣으면 첫 번째 경로에서 두 번째 경로로 가는 방법을 알림
- path.join() : 여러 인수를 넣으면 하나의 경로로 합침, 상대 경로인 ..과 .도 알아서 처리함
- path.resolve() : path.join과 비슷하지만 좀 다른데 /를 만나면 resolve는 절대 경로로 인식해서 앞의 경로를 무시하고, join은 상대 경로로 처리한다.

가끔 윈도에서 posix 스타일 경로를 사용할 때가 있고 그 반대일 때도 있는데 이 상황에서는 윈도에서 path.posix.sep이나 path.posix.join() 과 같이 사용하면 되고, posix에서는 path.win32.sep이나 path.win32.join()과 같이 사용하면 된다.

노드는 require.main 파일을 기준으로 상대 경로를 인식한다. 따라서 require.main과는 다른 디렉터리의 파일이 상대 경로를 갖고 있다면 예상과 다르게 동작할 수 있다. 
<hr>

### url
인터넷 주소를 쉽게 조작하도록 도와주는 모듈이다. url 처리에는 크게 두 가지 방식이 있다. 노드 버전 7에서 추가된 whatwg 방식의 url과 예전부터 노드에서 사용하던 방식의 url이 있다.

기존 노드 방식에는 두 메서드를 사용하는데 
- url.parse(주소) : 주소를 분해한다. whatwg 방식과 비교하면 username과 password 대신 auth 속성이 있고, searchParams 대신 query가 있다.
- url.format(객체) : whatwg 방식 url과 기존 노드의 url을 모두 사용할 수 있다. 분해되었던 url 객체를 다시 원래 상태로 조립한다.

whatwg와 노드의 url은 취향에 따라 사용하면 되지만, 노드의 url 형식을 꼭 사용해야 하는 경우가 있다. host 부분 없이 pathname 부분만 오는 주소인 경우에는 whatwg 방식이 처리할 수 없다.

whatwg 방식은 search 부분을 searchParams라는 특수한 객체로 반환하므로 유용하다. search 부분은 보통 주소를 통해 데이터를 전달할 때 사용된다. search는 물음표로 시작하고, 그 뒤에 키=값 형식으로 데이터를 전달한다. 여러 키가 있을 경우에는 &로 구분한다.

<br>
searchParams

```
$node searchParams
searchParams: URLSearchParams {
    ''= > ''
}
```

- getAll(키) : 키에 해당하는 모든 값들을 가져온다. category 키에는 nodejs와 javascript 라는 두 가지 값이 들어 있다.
- get(키) : 키에 해당하는 첫 번째 값만 가져온다.
- has(키) : 해당 키가 있는지 없는지를 검사한다.
- keys() : searchParams의 모든 키를 반복기 객체로 가져온다.
- values() : searchParams의 모든 값을 반복기 객체로 가져온다.
- append(키, 값) : 해당 키를 추가한다. 같은 키의 값이 있다면 유지하고 하나 더 추가한다.
- set(키, 값) : append와 비슷하지만, 같은 키의 값들을 모두 지우고 새로 추가한다
- delete(키) : 해당 키를 제거한다.
- toString : 조작한 searchParmas 객체를 다시 문자열로 만든다. 이 문자열을 search에 대입하면 주소 객체에 반영된다.
<hr>

### queryString
- querystring.parse(쿼리) : url의 query 부분을 자바스크립트 객체로 분해한다.
- querystring.stringfy(객체) : 분해된 query 객체를 문자열로 다시 조립한다.
<hr>

### crypto
다양한 방식의 암호화를 도와주는 모듈이다. 

#### 단방향 암호화
(교재상)
비밀번호는 보통 단방향 암호화 알고리즘을 사용해서 암호화한다. 단방향 암호화란 복호화할 수 없는 암호화 방식을 뜻한다. 복호화는 암호화된 문자열을 원래 문자열로 되돌려놓는 것을 의미한다. 즉, 단방향 암호화는 한 번 암호화하면 원래 문자열을 찾을 수 없다. 복호화할 수 없으므로 암호화라고 표현하는 대신 해시 함수라고 부르기도 한다.

단방향 암호화 알고리즘은 주로 해시 기법을 사용한다. 해시 기법이란 어떠한 문자열을 고정된 길이의 다른 문자열로 바꿔버리는 방식이다. 입력 문자열의 길이는 다르지만 출력 문자열의 길이는 네 자리로 고정되어 있다.

- createHash(알고리즘) : 사용할 해시 알고리즘을 넣는다. md5, sha1, sha256, sha512 ㅍ등이 가능하지만, md5와 sha1은 이미 취약점이 발견되었다. 현재는 sha512 정도로 충분하지만 나중에 이것마저도 취약해지면 더 강화된 알고리즘으로 바꿔야 한다.
- update(문자열) : 변환할 문자열을 넣는다.
- digest(인코딩) : 인코딩할 알고리즘을 넣는다. base64, hex, latin1이 주로 사용되는데, 그 중 base64가 결과 문자열이 가장 짧아 애용된다. 결과물로 변환된 문자열을 반환한다.

가끔 nopqrst라는 문자열이 qvew로 변환되어 abcdefgh를 넣었을 떄와 똑같은 출력 문자열로 바뀔 떄도 있다. 이런 상황을 충돌이 발생했다고 표현한다. 해킹용 컴퓨터의 역할은 어떠한 문자열이 같은 출력 문자열을 반환하는지 찾아내느 것이다. 여러 입력 문자열이 같은 출력 문자열로 변환될 수 있으므로 비밀번호를 abcdefgh로 설정했어도 nopqrst로 뚫리는 사태가 발생하게 된다. 

현재는 주로 pbkdf2나 bcrypt, scrypt라는 알고리즘으로 비밀번호를 암호화하고 있다. 그 중 노드에서 지원하는 pbkdf2는 간단히 말하면 기존 문자열에 salt라고 불리는 문자열을 붙인 후 해시 알고리즘을 반복해서 적용하는 것이다. 

#### 양방향 암호화
양방향 대칭형 암호화, 암호화된 문자열을 복호화할 수 있으며, 키라는 것이 사용된다. 대칭형 암호화에서 암호를 복호화하려면 암호화할 때 사용한 키와 같은 키를 사용해야 한다.

- cipher.update(문자열, 인코딩, 출력 인코딩) : 암호화할 대상과 대상의 인코딩, 출력 결과물의 인코딩을 넣는다. 보통 문자열은 utf8인코딩을, 암호는 base64를 많이 사용한다.
- cipher.final(출력 인코딩) : 출력 결과물의 인코딩을 넣으면 암호화가 완료된다.
- crypto.createDecipheriv(알고리즘, 키, iv) : 복호화할 때 사용한다. 암호화할 때 사용했던 알고리즘과 키, iv를 그대로 넣어야 한다.
- decipher.update(문자열, 인코딩, 출력 인코딩) : 암호화된 문장, 그 문장의 인코딩, 복호화할 인코딩을 넣는다. createCipherive의 update에서 utf8, base64 순으로 넣었다면 createDecipheriv의 update() 에서는 base64, utf8순으로 넣으면 된다.
- decipher.final(출력 인코딩) : 복호화 결과물의 인코딩을 넣는다.

<hr>

### util
util.. 이름처럼 각종 편의 기능을 모아둔 모듈이다.

- util.deprecate : 함수가 deprecated 처리 되었음을 알린다. 첫 번째 인수로 넣은 함수를 사용했을 때 경고 메시지가 출력된다. 두 번째 인수로 경고 메시지 내용을 넣으면 된다. 함수가 조만간 사라지거나 변경될 때 알려줄 수 있어 유용하다.
- util.promisify : 콜백 패턴을 프로미스 패턴으로 바꾼다. 바꿀 함수를 인수로 제공하면 된다. 이렇게 바꿔두면 async/await 패턴까지 사용할 수 있어 좋다.

<hr>

### worker_threads

노드에서 멀티 스레드 방식으로 작업하는 방법은 worker_threads 모듈을 이용하면 된다.

```js
const {
    Worker, isMainThread, parentPort
} = require('worker_threads');

if (isMainThread) {
    const worker = new Worker(__filename);
    worker.on('message', message => console.log('from worker', message));
    worker.on('exit', ()=> console.log('worker exit')));
    worker.postMessage('ping')
} else {
    parentPort.on('message', (value) => {
        console.log('from parent', value);
        parentPort.postMesage('pong');
        parentPort.close();
    })
}
```

isMainThread 를 통해 현재 코드가 메인 스레드에서 실행되는지, 아니면 우리가 생성한 워커 스레드에서 실행되는지 구분된다. 메인 스레드에서는 new Worker 를 통해 현재 파일을 워커 스레드에서 실행시키고 있다. 물론 현재 파일의 else 부분만 워커 스레드에서 실행된다.

부모에서는 워커 생성 후 worker.postMessage로 워커에 데이터를 보낼 수 있다. 워커는 parentPort.on('message') 이벤트 리스너로 부모로부터 메시지를 받고, parentPort.postMessage 로 부모에게 메시지를 보낸다. 부모는 worker.on('message')로 메시지를 받는다. 

워커에서 on 메서드를 사용할 때는 직접 워커를 종료해야 한다는 점에 주의해야 한다. parentPort.close() 를 하면 부모와의 연결이 종료된다. 

<hr>

### child_process
노드에서 다른 프로그램을 실행하고 싶거나 명령어를 수행하고 싶을 때 사용하는 모듈이다. 이 모듈을 통해 다른 언어의 코드를 실행하고 결괏값을 받을 수 있다. 이름이 child_process 인 이유는 현재 노드 프로세스 외에 새로운 프로세스를 띄워서 명령을 수행하고, 노드 프로세스에 결과를 알려주기 때문이다.

<hr>

### 기타 모듈들

- assert : 값을 비교하여 프로그램이 제대로 동작하는지 테스트하는데 사용한다.
- dns : 도메인 이름에 대한 ip 주소를 얻어내는데 사용한다.
- net : http보다 로우 레벨인 tcp나 ipc 통신을 할 때 사용한다.
- string_decode: 버퍼  데이터를 문자열로 바꾸는데 사용한다.
- tls : tls와 ssl에 관련된 작업을 할 때 사용한다.
- tty : 터미널과 관련된 작업을 할 때 사용한다.
- dgram : udp와 관련된 작업을 할 때 사용한다.
- v8 : v8 엔진에 직접 접근할 때 사용한다.
- vm : 가상 머신에 직접 접근할 때 사용한다.

<hr>

## 파일 시스템 접근하기

fs 모듈은 파일 시스템에 접근하는 모듈이다. 즉, 파일을 생성하거나 삭제하고, 읽거나 쓸 수 있다. 폴더도 만들거나 지울 수 있다. 웹 브라우저에서 자바스크립트를 사용할 때는 일부를 제외하고는 파일 시스템 접근이 금지되어 있으므로 노드의 fs 모듈이 낯설 것이다.

예
```js
const fs = require('fs')

fs.readFile('./readme.txt', (err, data) => {
    if (err) {
        throw err;
    }
    console.log(data);
    console.log(data.toString())
})
```

fs 모듈을 불러온 뒤 읽을 파일의 경로를 지정한다. 여기서는 파일의 경로가 현재 파일 기준이 아니라 node 명령어를 실행하는 콘솔 기준이라는 점에 유의해야 한다. 지금은 크게 상관없으나 폴더 내부에 들어 있는 파일을 실행할 때 경로 문제가 발생할 수 있다.

파일을 읽은 후에 실행될 콜백 함수도 readFile 메서드의인수로 같이 넣습니다. 이 콜백 함수의 매개변수로 에러 또는 데이터를 받는다. 파일을 읽다가 무슨 문제가 생겼다면 에러가 발생할 것이고, 정상적으로 읽었다면 해당 파일의 내용이 나올 것이다.

여기서 console.log(data) 의 경우에는 Buffer 라는 이상한 것이 출력된다.
```
<Buffer ec a0 80 eb a5 bc 20 ec ...>
```
이런식으로 출력이되서 toString()을 붙여서 로그를 찍습니다. readFile의 결과물은 버퍼라는 형식으로 제공된다. fs는 기본적으로 콜백 형식의 모듈이므로 실무에서 사용하기 불편하다. 따라서 fs 모듈을 프로미스 형식으로 바꿔주는 방법을 사용한다.

```js
const fs = require('fs').promises

fs.readFile('./readme.txt')
.then((data) => {
    console.log(data);
    console.log(data.toString());
})
.catch((err) => {
    console.error(err);
})
```

이렇게 하면 promise 기반의 fs 모듈을 사용할 수 있게 된다. 이번에는 파일을 만들어보겠다.

```js
const fs = require('fs').promises;

fs.writeFile('./writeme.txt', '글이 입력됩니다')
.then(()=> {
    return fs.readFile('./writeme.txt');
})
.then((data) => {
    console.log(data.toString())
})
.catch((err) => {
    console.error(err)
})
```

<hr>

### 동기 메서드와 비동기 메서드
setTimeout 같은 타이머와 process.nextTick 외에도, 노드는 대부분의 메서드를 비동기 방식으로 처리한다. 하지만 몇몇 메서드는 동기 방식으로도 사용할 수 있다. 특히 fs 모듈이 그러한 메서드를 많이 가지고 있다.

```js
const fs = require('fs')
console.log("시작")
fs.readFile('./readme.txt', (err, data) => {
    if (err) {
        throw err;
    }
    console.log("1번", data.toString())
})
fs.readFile('./readme.txt', (err, data) => {
    if (err) {
        throw err;
    }
    console.log("2번",data.toString())
})
fs.readFile('./readme.txt', (err, data) => {
    if (err) {
        throw err;
    }
    console.log("3번",data.toString())
})
fs.readFile('./readme.txt', (err, data) => {
    if (err) {
        throw err;
    }
    console.log("4번",data.toString())
})
console.log("끝")
```

이런식으로 작성을 하면 시작과 끝을 제외하고는 결과의 순서가 다를 수 있다.

비동기 메서드들은 백그라운드에 해당 파일을 읽으라고만 요청하고 다음 작업으로 넘어간다.
따라서 파일 읽기 요청만 세 번 보내고 console.log('끝')을 찍는다. 나중에 읽기가 완료되면 백그라운드가 다시 메인 스레드에 알린다. 그 상태에서 등록된 콜백 함수를 실행하는 것이다.

이 방식은 상당히 좋다. 수백 개의 I/O 요청이 들어와도 메인 스레드는 백그라운드에 요청 처리를 위임한다. 그 후로도 얼마든지 요청을 더 받을 수 있다. 나중에 처리가 완료되면 그때 콜백 함수를 처리하면 되기 때문이다.

순서대로 찍고 싶다면 

```js
const fs = require('fs')
console.log("시작")
let data = fs.eadFileSync('./readme.txt');
console.log('1번', data.toString())
data = fs.eadFileSync('./readme.txt');
console.log('2번', data.toString())
data = fs.eadFileSync('./readme.txt');
console.log('3번', data.toString())
data = fs.eadFileSync('./readme.txt');
console.log('4번', data.toString())
console.log("끝")
```

readFile 대신 readFileSync를 사용하면 되는데 콜백 함수를 넣는 대신 직접 return 값을 받아온다. 

하지만 readFileSync를 사용하면 요청이 수백 개 이상 들어올 때 성능에 문제가 생긴다. 이전 작업이 완료되어야 다음 작업을 진행하기에 이전 작업이 진행 되기 전까지는 아무것도 하지 못하고 대기하고 있어야 하는 것이다. 백그라운드는 fs 작업을 동시에 처리할 수도 있는데, Sync 메서드를 사용하면 백그라운드조차 동시에 처리할 수 없게 된다. 비동기 fs 메서드를 사용하면 백그라운드가 동시에 작업할 수도 있고, 메인 스레드는 다음 작업을 처리할 수 있다.

동기 메서드들은 이름 뒤에 Sync 가 붙어 있어 구분하기 쉽다. writeFileSync 도 있다. 하지만 동기 메서드를 사용해야 하는 경우는 극히 드물다. 프로그램을 처음 실행할 때 초기화용도로만 사용하는 것을 권장한다.

그렇다면 비동기 방식으로 하는데 순서를 유지하고 싶다면 이전 readFile의 콜백에 다음 readFile을 넣으면 된다. 이런식으로 작성하면 콜백 지옥이 펼쳐지지만 순서는 제대로 찍히게 됩니다.

물론 콜백 지옥도 async/await로 어느정도 해결할 수 있다. 지

<hr>
 
### 버퍼와 스트림 이해

파일을 읽거나 쓰는 방식에는 크게 두 가지 방식, 즉 버퍼를 이용하는 방식과 스트림을 이용하는 방식이 있다. 버퍼링과 스트리밍이라는 용어를 알텐데 영상을 로딩할 때는 버퍼링이라고 하고, 영상을 실시간으로 송출할 때는 스트리밍이라고 한다.

버퍼링은 영상을 재생할 수 있을 떄까지 데이터를 모으는 동작이고, 스트리밍은 영상 데이터를 조금씩 전소앟는 동작이다.

노드의 버퍼와 스트림도 비슷한 개념이다. 앞에서 작성했던 것은 버퍼 형식으로 출력되었었다. 노드는 파일을 읽을 때 메모리에 파일 크기만큼 공간을 마련해두며 파일 데이터를 메모리에 저장한 뒤 사용자가 조작할 수 있도록 한다. 이때 메모리에 저장된 데이터가 바로 버퍼이다.

- from(문자열) : 문자열을 버퍼로 바꿀 수 있다. length 속성은 버퍼의 크기를 알린다. 바이트 단위이다.
- toString(버퍼) : 버퍼를 다시 문자열로 바꾼다.
- concat(배열) : 배열 안에 든 버퍼들을 하나로 합친다.
- alloc(바이트) : 빈 버퍼를 생성한다. 바이트를 인수로 너흥면 해당 크기의 버퍼가 생성된다.

readFile 방식의 버퍼가 편리하기는 하지만 문제점도 있다. 만약 용량이 100mb인 파일이 있으면 읽을 때 메모리에 100mb의 버퍼를 만들어야 한다. 이런 작업을 10개만 해도 1gb이다. 서버처럼 몇 명이 이용할지 모르는 환경에서는 메모리 문제가 발생할 수 있기에 버퍼의 크기를 작게 만든 후 여러 번으로 나눠 보내는 방식이 등장했다. 1mb 버퍼를 만든 후 100mb 파일을 100번 나눠 보내는 것이다. 이를 편리하게 만든 것이 스트림이다.

파일을 읽는 스트림 메서드로는 createReadStream이 있다.

```js
const fs = require('fs')

const readStream = fs.createReadStream('./readme3.txt', {highWaterMark:16})
const data = [];

readStream.on('data', (chunk) => {
    data.push(chunk);
    console.log('data : ', chunk, chunk.length)
})

readStream.on('end', () => {
    console.log('end :', Buffer.concat(data).toString());
});

readStream.on('error', (err) => {
    console.log('error :', err)
})
```

먼저 createReadStream으로 읽기 스트림을 만든다. 첫 번쨰 인수로 읽을 파일 경로를 넣는다. 두 번째 인수는 옵션 객체인데 highWaterMark라는 옵션이 버퍼의 크기를 정할 수 있는 옵션이다. 기본값은 64kb이지만, 여러 번 나눠서 보내는 모습을 보여주기 위해 16b로 낮췄다.

readStream은 이벤트 리스너를 붙여서 사용한다. 보통 data, end, error 이벤트를 사용한다.

위 예제의 readStream.on('data') 와 같이 이벤트 리스너를 붙이면 된다. 파일을 읽는 도중 에러가 발생하면 error 이벤트가 호출되고, 파일 읽기가 시작되면 data 이벤트가 발생한다. 16b씩 읽도록 설정했으므로 파일의 크기가 16b보다 크다면 여러 번 발생할 수도 있다. 파일을 다 읽으면 end 메서드로 종료를 알린다. 이때 finish 이벤트가 발생한다. 

createReadStream으로 파일을 읽고 그 스트림을 전달받아 createWriteStream으로 파일을 쓸 수도 있다. 파일 복사와 비슷하다. 스트림끼리 연결하는 것을 '파이핑한다'고 표현한다. 액체가 흐르는 관처럼 데이터가 흐른다고 해서 지어진 이름이다.

미리 읽기 스트림과 쓰기 스트림을 만들어둔 후 두 개의 스트림 사이를 pipe 메서드로 연결하면 저절로 데이터가 writeStream으로 넘어간다. pipe는 스트림 사이에 여러 번 연결할 수 있다. 다음 코드는 파일을 읽은 후 gzip 방식으로 압축하는 코드이다.

```js
const zlib = require('zlib');
const fs = require('fs');

const readStream = fs.createReadStream('./readme.txt');
const zlibStream = zlib.createGzip();
const writeStream = fs.createWriteStream('./readme.txt.gz');
readStream.pipe(zlibStream).pipe(writeStream);
```

노드에서는 파일을 압축하는 zlib라는 모듈도 제공한다. zlib의 createGzip이라는 메서드가 스트림을 지원하므로 readStream과 writeStream 중간에서 파이핑 할 수 있다. 버퍼 데이터가 전달되다가 gzip압축을 거친 후 파일로 써진다.

### 기타 fs 메서드 알아보기
위에서는 단순히 파일 읽기/쓰기를 했지만, 파일을 생성하고 삭제할 수 있으며 폴더를 생성하고 삭제할 수도 있다.

- fs.access(경로, 옵션, 콜백) : 폴더나 파일에 접근할 수 있는지를 체크한다. 두 번째 인수로 상수들을 넣었다. F_OK 는 파일 존재 여부, R_OK는 읽기 권한 여부, W_OK는 쓰기 권한 여부를 체크한다. 파일/폴더나 권한이 없다면 에러가 발생하는데 파일/폴더가 없을 떄의 에러 코드는 ENOENT 이다.
- fs.mkdir(경로, 콜백) : 폴더를 만드는 메서드이다. 이미 폴더가 있다면 에러가 발생하므로 먼저 access 메서드를 호출해서 확인하는 것이 중요하다.
- fs.open(경로, 옵션, 콜백) : 파일의 아이디를 가져오는 메서드이다. 파일이 없다면 파일을 생성한 뒤 그 아이디를 가져온다. 가져온 아이디를 사용해 fs.read나 fs.write로 읽거나 쓸 수 있다. 두 번째 인수로 어떤 동작을 할 것인지를 설정할 수 있다. 쓰려면 w, 읽으려면 r, 기존 파일에 추가하려면 a이다. 
- fs.rename(기존 경로, 새 경로, 콜백) : 파일의 이름을 바꾸는 메서드이다. 기존 파일 위치와 새로운 파일 위치를 적으면 된다. 꼭 같은 폴더를 지정할 필요는 없으므로 잘라내기 같은 기능을 할 수 있다.
- fs.readdir(경로, 콜백) : 폴더 안의 내용물을 확인할 수 있다. 배열 안에 내부 파일과 폴더명이 나온다.
- fs.unlink(경로, 콜백) : 파일을 지울 수 있다. 파일이 없다면 에러가 발생하므로 먼저 파일이 있는지를 꼭 확인해야 한다. 
- fs.rmdir(경로, 콜백) : 폴더를 지울 수 있다. 폴더 안에 파일들이 있다면 에러가 발생하므로 먼저 내부 파일을 모두 지우고 호출해야 한다.

<hr>

### 스레드풀
비동기 메서드들은 백그라운드에서 실행되고, 실행된 후에는 다시 메인 스레드의 콜백 함수나 프로미스의 then 부분이 실행된다. 이때 fs 메서드를 여러 번 실행해도 백그라운드에서 동시에 처리되는데 바로 스레드풀이 있기 때문이다.

교재 (157쪽) 스레드풀 개수만큼 작업을 동시에 처리한다.

스레드풀을 직접 컨트롤할 수는 없지만 개수를 조절할 수는 있다.
윈도우라면 set uv_threadpool_size=1을, 맥과 리눅스는 터미널에 uv_threadpool_size=1을 입력한 후 다시 node threadpool을 입력하면 작업이 순서대로 실행될 것이다. 스레드의 개수를 8로 두면 또 다른 결과가 발생할 것이다. 숫자를 크게 할 때는 자신의 컴퓨터 코어 개수와 같거나 많게 두어야 뚜렷한 효과가 발생한다.

<hr>

## 이벤트 이해하기

스트림을 배울 때 on('data', 콜백) 또는 on('data', 콜백) 을 사용했다. 바로 data라는 이벤트와 end라는 이벤트가 발생할 때 콜백 함수를 호출하도록 이벤트를 등록한 것이다. createReadStream 같은 경우는 내부적으로 알아서 data와 end 이벤트를 호출하지만, 우리가 직접 이벤트를 만들 수도 있다.

event 모듈을 사용하면 된다. 객체는 이벤트 관리를 위한 메서드를 가지고 있다
- on(이벤트명, 콜백) : 이벤트 이름과 이벤트 발생 시의 콜백을 연결한다. 이렇게 연결하는 동작을 이벤트 리스닝이라고 부른다. event2 처럼 이벤트 하나에 이벤트 여러 개를 달아줄 수도 있다.
- addListener(이벤트명, 콜백) : on과 기능이 같다.
- emit(이벤트명) : 이벤트를 호출하는 메서드이다. 이벤트 이름을 인수로 넣으면 미리 등록 해뒀던 이벤트 콜백이 실행된다.
- once(이벤트명, 콜백) : 한 번만 실행되는 이벤트이다.
- removeAllListeners(이벤트명) : 이벤트에 연결된 모든 이벤트 리스너를 제거한다.
- removeListener(이벤트명, 리스너) : 이벤트에 연결된 리스너를 하나씩 제거한다. 리스너를 넣어야 한다는 것은 잊지말아야 한다.
- off(이벤트명, 콜백) : 노드 10 버전에서 추가된 메서드로, removeListener와 기능이 같다.
- listenerCount(이벤트명) : 현재 리스너가 몇 개 연결되어 있는지 확인한다.

위에서 정리한 개념들만으로도 서버를 만들기 충분하지만 서버를운영할 때 코드에 에러가 발생하는 것은 치명적이므로, 마지막으로 에러를 처리하는 방법을 공부하겠다.

<hr>

## 예외 처리
(교재상으로) 
노드에서는 예외 처리가 정말 중요하다. 예외란 보통 처리하지 못한 에러를 가리킨다. 이러한 예외들은 실행 중인 노드 프로세스를 멈추게 한다. 

멀티 스레드 프로그램에서는 스레드 하나가 멈추면 그 일을 다른 스레드가 대신합니다. 하지만 노드의 메인 스레드는 하나뿐이므로 그 하나를 소중히 보호해야 합니다. 메인 스레드가 에러로 인해 멈춘다는 것은 스레드를 갖고 있는 프로세스가 멈춘다는 뜻이고, 전체 서버도 멈춘다는 뜻과 같습니다. 아무리 신중을 기해 만들었다고 해도 항상 예기치 못한 에러는 발생하는 법입니다.

따라서 예러를 처리하는 방법을 익혀두어야 합니다. 에러 로그가 기록되더라도 작업은 계속 진행될 수 있도록 말입니다.

문법상의 에러는 없다고 가정하겠습니다. 실제 배포용 코드에 문법 에러가 있어서는 안됩니다.

에러가 발생할 것 같은 부분을 try/catch문으로 감싸면 된다.
```js
setInterval(()=>{
    console.log('start')
    try {
        throw new Error('broken server!')
    } catch (err){
        console.error(err)
    }
}, 1000);
```

setInterval을 사용한 것은 프로세스가 멈추는지 여부를 체크하기 위해서이다. 프로세스가 에러로 인해 멈추면 setInterval도 멈출 것이다. setInterval 내부에 throw new Error()를 써서 에러를 강제로 발생 시켰다.
에러는 발생하지만 try/catch로 잡을 수 있고 setInterval도 직접 멈추기 전까지 계속 실행된다. 이렇게 에러가 발생할 것 같은 부분을 미리 try/catch로 감싸면 된다.

이번에는 노드 자체에서 잡아주는 에러를 알아보겠다.
```js
const fs = require('fs');

setInterval(() => {
    fs.unlink('./abcdefg.js', (err) => {
        if(err) {
            console.error(err)
        }
    })
}, 1000)
```

fs.unlink로 존재하지 않는 파일을 지우고 있다. 에러가 발생하지만 다행히 노드 내장 모듈의 에러는 실행중인 프로세스를 멈추지 않는다. 에러 로그를 기록해두고 나중에 원인을 찾아 수정하면 된다. 프로밍스의 에러는 catch하지 않아도 알아서 처리된다.

다만 프로미스의 에러를 알아서 처리하는 동작은 노드 버전이 올라감에 따라 바뀔 수 있다. 따라서 프로미스를 사용할 때는 항상 catch를 붙여주는 것을 권장한다.

uncaughtException 은 단순히 에러 내용을 기록하는 정도로 사용하고, 에러를 기록한 후 process.exit() 으로 프로세스를 종료하는 것이 좋습니다. 에러가 발생하는 코드를 수정하지 않는 이상, 프로세스가 실행되는 동안 에러는 계속 발생할 것이다.
<hr>

### 자주 발생하는 에러들
- node : command not found : 노드를 설치했지만 이 에러가 발생하는 경우에는 환경 변수가 제대로 설정되지 않은 것이다. 환경 변수에는 노드가 설치된 경로가 포함되어야 한다. 
- ReferenceError : 모듈 is not defined : 모듈을 require 했는지 확인
- Error : Cannot find module 모듈명 : 해당 모듈을 require 했지만 설치하지 않았다. npm i 로 설치하시오
- Error : Can't set headers after they are sent : 요청에 대한 응답을 보낼 때 응답을 두 번 이상 보냈다. 요청에 대한 응답은 한 번만 보내야 ㅏㄴ다. 응답을 보내는 메서드를 두 번 이상 사용하지 않았는지 체크해봐야한다.
- 이 외의 것들은 교재 165쪽에 있다.

<hr>
<br>

# http 모듈로 서버 만들기

이번 챕터에서는 실제로 돌아가는 서버를 만든다.

## 요청과 응답 이해하기
서버는 클라이언트가 있기에 동작한다. 클라이언트에서 서버로 요청을 보내고, 서버에서는 요청의 내용을 읽고 처리한 뒤 클라이언트에 응답을 보낸다. 

따라서 서버에는 요청을 받는 부분과 응답을 보내는 부분이 있어야 한다. 요청과 응답은 이벤트 방식이라고 생각하면 된다. 클라이언트로부터 요청이 왔을 때 어떤 작업을 수행할지 이벤트 리스너를 미리 등록해둬야 한다.

createServer.js
```js
const http = require('http');

http.createServer((req, res)=>{
    
})
```

http 서버가 있어야 웹 브라우저의 요청을 처리할 수 있으므로 http 모듈을 사용했다. http 모듈에는 createServer 메서드가 있다. 인수로 요청에 대한 콜백 함수를 넣을 수 있으며, 요청이 들어올 때마다 매번 콜백 함수가 실행된다. 따라서 이 콜백 함수에 응답을 적으면 된다.

createServer를 보면 req 와 res 매개변수가 있다. req객체는 요청에 관한 정보들을, res 객체는 요청에 관한 정보들을, res 객체는 응답에 관한 정보들을 담고 있다.

server1.js
```js
const http = require('http');

http.createServer((req, res)=>{
    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
})

.listen(8080, () => {
    console.log('8080번 포트에서 서버 대기 중입니다.');
})
```

```
$ node server1
```

터미널 혹은 cmd 창에 위 텍스트를 입력하면 서버가 실행된다. 서버를 종료하려면 Control+ c 누르면 된다. 

res 객체에는 res.writeHead와 res.write, res.end 메서드가 있다. res.writeHead는 응답에 대한 정보를 기록하는 메서드이다. 첫 번째 인수로 성공적인 요청임을 의미하는 200을, 두 번째 인수로 응답에 대한 정보를 보내는데 콘텐츠의 형식이 html 임을 알리고 있다. 또한 한글 표시를 위해 charset을 utf-8로 지정했다. 이 정보가 기록되는 부분을 헤더라고 부른다.

res.write 메서드의 첫 번째 인수는 클라이언트로 보낼 데이터이다. 지금은 html 모양의 문자열을 보냈지만 버퍼를 보낼 수도 있다. 또한 여러 번 호출해서 데이터를 여러 개 보내도 된다. 데이터가 기록되는 부분을 본문이라고 부른다.

res.end는 응답을 종료하는 메서드이다. 만약 인수가 있다면 그 데이터도 클라이언트로 보내고 응답을 종료한다. 따라서 위의 예제는 res.write에서 h1 태그로 작성된 hello node 문자열을, res.end에서 hello server 문자열을 클라이언트로 보낸 후 응답이 종료된 것이다. 브라우저는 응답 내용을 받아서 렌더링 한다.

listen 메서드에 콜백 함수를 넣는 대신, 다음과 같이 서버에 listening 이벤트 리스너를 붙여도 된다. 추가로 error 이벤트 리스너도 붙여보겠다.

server1-1.js
```js
const http = require('http');

http.createServer((req, res)=>{
    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
})

.listen(8080);

server.on('listening', ()=>{
    console.log("8080번 포트에서 서버 대기중 입니다")
})

server.on('error', (error) => {
    console.error(error);
})
```

한 번에 여러 서버를 실행할 수도 있다. createServer를 원하는 만큼 호출하면 되는것이다.

server2.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Node 웹 서버</title>
</head>
<body>
    <h1>Node js 웹 서버</h1>
    <p>만들 준비 완료</p>
</body>
</html>
```

server2.js
```js
const http = require('http');
const fs = require('fs').promises;

http.createServer(async (req, res) => {
    try {
        const data = await fs.readFile('./server2.html');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
        res.end(data);
    } catch (error) {
        console.error(error);
        res.writeHead(500, {'Content-Type': 'text/plain; charset=utf8'});
        res.end(error.message);
    }
})

.listen(8080, () => {
    console.log('8080번 포트에서 서버 대기 중입니다.');
})
```

요청이 들어오면 fs모듈로 html 파일을 읽습니다. data 변수에 저장된 버퍼를 그대로 클라이언트에 보내면 된다. 이전 예제에서는 문자열을 보냈지만 저렇게 버퍼를 보낼 수도 있다. 예기치 못한 에러가 발생한 경우에는 에러 메시지를 응답한다. 에러 메시지는 일반 문자열이므로 text/plain을 사용했다.

<hr>

### rest와 라우팅 사용하기
서버에 요청을 보낼 때는 주소를 통해 요청의 내용을 표현한다.

요청의 내용이 주소를 통해 표현되므로 서버가 이해하기 쉬운 주소를 사용하는 것이 좋다. 여기서 rest가 등장한다.

rest 는 REpresentational State Transfer의 줄임말이며, 서버의 자원을 정의하고 자원에 대한 주소를 지정하는 방법을 가리킨다. 일종의 약속이라고 봐도 무방하다. 자원이라고 해서 꼭 파일일 필요는 없고 서버가 행할 수 있는 것들을 통틀어서 의미한다고 보면 된다. REST API에는 많은 규칙들이 있는데 다 지키는 것은 현실적으로 어렵다.

주소는 의미를 명확히 전달하기 위해 명사로 구성된다. /user이면 사용자 정보에 관련된 자원을 요청하는 것이고, /post라면 게시글에 관련된 자원을 요청하는 것이라고 추측 가능하다.

단순한 명사만 있으면 무슨 동작을 행하라는 것인지 알기 어려우니 REST에서는 주소 외에도 HTTP 요청 메서드라는 것을 사용한다. 폼 데이터를 전송할 때 get 또는 post 메서드를 지정하는데 이 두가지가 요청 메서드 중의 하나이다.

- GET : 서버 자원을 가져오고자 할 때 사용한다. 요청의 본문에 데이터를 넣지 않는다. 데이터를 서버로 보내야 한다면 쿼리스트링을 사용한다.
- POST : 서버에 자원을 새로 등록하고자 할 때 사용한다. 요청의 본문에 새로 등록할 데이터를 넣어 보낸다.
- PUT : 서버의 자원을 요청에 들어 있는 자원으로 치환하고자 할 떄 사용한다. 요청의 본문에 치환할 데이터를 넣어 보낸다.
- PATCH : 서버 자원의 일부만 수정하고자 할 때 사용한다. 요청의 본문에 일부 수정할 데이터를 넣어 보낸다.
- DELETE : 서버의 자원을 삭제하고자 할 때 사용하낟. 요청의 본문에 데이털르 넣지 않는다.
- OPTIONS : 요청을 하기 전에 통신 옵션을 설명하기 위해 사용한다.

이렇게 주소와 메서드만 보고 요청의 내용을 알아볼 수 있다는 것이 장점이다. 또한, GET 메서드 같은 경우에는 브라우저에서 캐싱할 수도 있으므로 같은 주소로 GET 요청을 할 때 서버에서 가져오는 것이 아니라 캐시에서 가져올 수도 있다. 이렇게 캐싱이 되면 성능이 좋아진다.

그리고 HTTP 통신을 사용하면 클라이언트가 누구든 상관없이 같은 방식으로 서버와 소통할 수 있다. 즉 서버와 클라이언트가 분리되어 있기에 추후에 서버를 확장할 때 클라이언트에 구애되지 않아서 좋다.

코드들 : https://github.com/ZeroCho/nodejs-book/blob/master/ch4/

restServer.js가 핵심이다. 코드를 보면 req.method로 http 요청 메서드를 구분하고 있다. 메서드가 get이면 다시 req.url로 요청 주소를 구분한다. 주소가 /일 때는 restFront.html을 제공하고, 주소가 /about이면 about.html 파일을 제공한다. 각 주소별로 그 파일을 제공한다. 만약 존재하지 않는 파일을 요청했거나 get 메서드 요청이 아닌 경우라면 404 NOT FOUND 에러가 응답으로 전소오딘다. 응답 과정 중에 예기치 못한 에러가 발생한 경우에는 500 에러가 응답으로 전송된다.

restServer.js를 보면 POST와 PUT 요청을 처리할 때 조금 특이한 것을 볼 수 있다. 바로 req.on('data')와 req.on('end') 의 사용이다. 요청의 본문에 들어 있는 데이터를 꺼내기 위한 작업이라고 보면 된다. req와 res도 내부적으로는 스트림으로 되어 있으므로 요청/응답의 데이터가 스트림 형식으로 전달된다. 또한 on에서 볼 수 있듯이 이벤트도 달려있다.

Network 탭에서 네트워크 요청 내용을 실시간으로 볼 수 있다. REST 방식으로 주소를 만들었으므로 주소와 메서드만 봐도 요청 내용을 유추할 수 있다. Name은 요청 주소를, Method는 요청 메서드를, Status는 HTTP 응답 코드를, Protocol은 통신 프로토콜을, Type은 요청의 종류를 의미한다. xhr 은 AJAX 요청이다.

<hr>

### 쿠키와 세션 이해하기
(교재상)

클라이언트에서 보내는 요청에는 한 가지 큰 단점이 있다. 바로 누가 요청을 보내는지 모른다는 것이다. 물론 요청을 보내는 IP주소나 브라우저의 정보를 받아올 수는 있다. 하지만 여러 컴퓨터가 공통으로 IP 주소를 가지거나, 한 컴퓨터를 여러 사람이 사용할 수도 있다. 

그렇다면 로그인을 구현하면 되지 않느냐고 생각할 수도 있다. 정답이다. 하지만 로그인을 구현하려면 쿠키와 세션에 대해 알고 있어야 한다. 사용자가 누구인지 기억하기 위해 서버는 요청에 대한 응답을 할 때 쿠키라는 것을 같이 보낸다. 쿠키는 유효 기간이 있으며 name=zerocho와 같이 단순한 '키-값'의 쌍이다. 서버로부터 쿠키가 오면 웹 브라우저는 쿠리를 저장해두었다가 다음에 요청할 때마다 쿠키를 동봉해서 보낸다. 서버는 요청에 들어 있는 쿠키를 읽어서 사용자가 누구인지 파악한다.

브라우저는 쿠키가 있다면 자동으로 동봉해서 보내주므로 따로 처리할 필요가 없다. 서버에서 브라우저로 쿠키를 보낼 때만 코드로 작성하여 처리하면 된다.

즉, 서버는 미리 클라이언트에 요청자가 추정할 만한 정보를 쿠키로 만들어 보내고, 그 다음부터는 클라이언트로부터 쿠키를 받아 요청자를 파악한다. 쿠키가 여러분이 누구인지 추적하고 있는 것이다. 개인정보 유출 방지를 위해 쿠키를 주기적으로 지우라고 권고하는 것은 바로 이러한 이유 때문이다.

쿠키는 요청의 헤더에 담겨 전송된다. 브라우저는응답의 헤더에 따라 쿠키를 저장한다. 

서버에서 직접 쿠키를 만들어 요청자의 브라우저에 넣어보겠다.

```js
const http = require('http')

http.createServer((req, res) => {
    console.log(req.url, res.headers.cookie);
    res.writeHead(200, {'Set-Cookie' : 'mycookie=test'});
    res.end('Hello Cookie')
})

.listen(8080, () => {
    console.log('8080번 포트에서 서버 대기 중입니다.')
})
```

쿠키는 name=zerocho;year1994 처럼 문자열 형식으로 존재한다. 쿠키 간에는 세미콜로능로 구분된다

createServer 메서드의 콜백에서는 req 객체에 담겨 있는 쿠키를 가져온다. 쿠키는 req.headers.cookie에 들어 있다. req.headers는 요청의 헤더를 의미한다. 조금 전에 쿠키는 요청과 응답의 헤더를 통해 오간다고 이야기 했는데 응답의 헤어데 쿠키를 기록해야 하므로 res.writeHead 메서드를 사용했다. Set-Cookie 는 브라우저한테 다음과 같은 값의 쿠키를 저장하라는 의미이다. 실제로 응답을 받은 브라우저는 mycookie=test라는 쿠키를 저장한다.

```
/ undefined
/favicon.ico mycookie=test
```

만약 실행 결과가 위와 다르다면 브라우저의 쿠키를 모두 제거한 후에 다시 실행해야 한다.

/favicon.ico는 요청한 적이 없는데 요청은 분명 한 번만 보냈는데 두 개가 기록되어 있다. 첫 번째 요청에서는 쿠키에 대한 정보가 없다고 나오며, 두 번째 요청에서는 mycookie:'test' 가 기록되어 있다.

브라우저는 파비콘이 뭔지 html에서 유추할 수 없으면 서버에 파비콘 정보에 대한 요청을 보낸다. 현재 예제에서는 html에 파비콘에 대한 정보를 넣어두지 않았으므로 브라우저가 추가로 요청한 것이다.

요청 두개를 통해 서버가 제대로 쿠키를 심었음을 확인할 수 있다. 첫 번째 요청을 보내기 전에는 브라우저가 어떠한 쿠키 정보도 가지고 있지 않다. 서버는 응답의 헤더에 mycookie=test라는 쿠키를 심으라고 브라우저에게 명령했다. 따라서 브라우저는 쿠키를 심었고, 두 번째 요청의 헤더에 쿠키가 들어 있음을 확인할 수 있다.

하지만 위 코드는 단순한 쿠키만 심었을 뿐, 그 쿠키가 나인지를 식별해주지 못하고 있다. 이제 사용자를 식별하는 방법을 알아보자

```js
const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') =>
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

http.createServer(async (req, res) => {
  const cookies = parseCookies(req.headers.cookie); // { mycookie: 'test' }
  // 주소가 /login으로 시작하는 경우
  if (req.url.startsWith('/login')) {
    const { query } = url.parse(req.url);
    const { name } = qs.parse(query);
    const expires = new Date();
    // 쿠키 유효 시간을 현재시간 + 5분으로 설정
    expires.setMinutes(expires.getMinutes() + 5);
    res.writeHead(302, {
      Location: '/',
      'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
    });
    res.end();
  // name이라는 쿠키가 있는 경우
  } else if (cookies.name) {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`${cookies.name}님 안녕하세요`);
  } else {
    try {
      const data = await fs.readFile('./cookie2.html');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(err.message);
    }
  }
})
  .listen(8080, () => {
    console.log('8080번 포트에서 서버 대기 중입니다!');
  });
```

코드가 좀 복잡해졌다. 주소가 /login과 /로 시작하는 것까지 두 개 이므로 주소별로 분기처리를 했다.

- 쿠키는 mycookie=test 같은 문자열이다. 이를 쉽게 사용하기 위해 자바스크립트 객체 형식으로 바꾸는 함수이다. 이 함수를 거치면 json과 비슷하게 {mycookie : 'test'}가 된다. 내부 내용은 중요하지 않으므로 이해하지 않아도 된다. 그저 parseCookies 함수가 문자열을 객체로 바꿔준다고만 알고 있으면 된다.
- 주소가 /login으로 시작할 경우에는 url과 querystring 모듈로 각각 주소와 주소에 딸려오는 query를 분석한다. 그리고 쿠키의 만료 시간도 지금으로부터 5분 뒤로 설정했다. 이제 302 응답 코드, 리다이렉트 주소와 함께 쿠키를 헤더에 넣었다. 브라우저는 이 응답 코드를 보고 페이지를 해당 주소로 리다이렉트 한다. 헤더에는 한글을 설정할 수 없으므로 name 변수를 encodeURIComponent 메서드로 인코딩했다. 또한 Set-Cookie의 값으로는 제한된 ASCII 코드만 들어가야 하므로 줄바꿈을 넣으면 안된다.
- 그 외의 경우(/로 접속했을 때 등), 먼저 쿠키가 있는지 없는지를 확인한다. 쿠키가 없다면 로그인 할 수 있는 페이지를 보낸다. 처음 방문한 경우에는 쿠키가 없으므로 cookie2, html이 전송된다. 쿠키가 있다면 로그인한 상태로 간주하여 인사말을 보낸다.

Set-Cookie로 쿠키를 설정할 때 만료 시간과 HttpOnly, Path같은 옵션을 부여했다. 쿠키를 설정할 떄는 각종 옵션을 넣을 수 있으며 옵션 사이에는 세미콜론을 써서 구분하면 된다. 쿠키에는 들어가면 안되는 글자들이 있는데, 대표적으로 한글과 줄바꿈이 있다. 한글은 encodeURIComponent로 감싸서 넣는다.

- 쿠키명=쿠키값 : 기본적인 쿠키의 값이다. mycookie=test 같이 설정한다.
- Expires=날짜 : 만료 기한이다. 이 기한이 지나면 쿠키가 제거된다. 기본값은 클라이언트가 종료될 때까지 이다.
- Max-age=초 : Expires 와 비슷하지만 날짜 대신 초를 입력할 수 있다. 해당 초가 지나면 쿠키가 제거된다.
- Domain=도메인명 : 쿠키가 전송될 도메인을 특정할 수 있다. 기본값은 현재 도메인이다.
- Path=URL : 쿠키가 전송될 URL을 특정할 수 있다. 기본값은 '/' 이고, 이 경우 모든 URL에서 쿠키를 전송할 수 있다.
- Secure : HTTPS 일 경우에만 쿠키가 전송된다.
- HttpOnly: 설정 시 자바스크립트에서 쿠키에 접근할 수 없다. 쿠키 조작을 방지하기 위해 설정하는 것이 좋다.

이제는 새로고침을 해도 로그인이 유지된다. 원하는대로 동작하기는 하지만 이 방식은 상당히 위험하다. Application 탭에서 보이는 것처럼 쿠키가 노출되어 있다. 또한, 쿠키가 조작될 위험도 있다. 그래서 이름 같은 민감한 정보를 쿠키에 넣는것은 적절하지 못하다.

session.js
```js
const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') =>
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

const session = {};

http.createServer(async (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  if (req.url.startsWith('/login')) {
    const { query } = url.parse(req.url);
    const { name } = qs.parse(query);
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);
    const uniqueInt = Date.now();
    session[uniqueInt] = {
      name,
      expires,
    };
    res.writeHead(302, {
      Location: '/',
      'Set-Cookie': `session=${uniqueInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
    });
    res.end();
  // 세션쿠키가 존재하고, 만료 기간이 지나지 않았다면
  } else if (cookies.session && session[cookies.session].expires > new Date()) {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`${session[cookies.session].name}님 안녕하세요`);
  } else {
    try {
      const data = await fs.readFile('./cookie2.html');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(err.message);
    }
  }
})
  .listen(8085, () => {
    console.log('8085번 포트에서 서버 대기 중입니다!');
  });
```

cookie2.js 와는 달라진 부분이 있다. 쿠키에 이름을 담는 대신, uniqueInt라는 숫자 값을 보냈다. 사용자의 이름과 만료 시간은 uniqueInt 속성명 아래에 이쓴ㄴ session이라는 객체에 대신 저장한다.

이제 cookie.session이 있고 만료 기한을 넘기지 않았다면 session 변수에서 사용자 정보를 가져와 사용한다.

이 방식이 세션이다. 서버에 사용자 정보를 저장하고 클라이언트와는 세션 아이디로만 소통한다. 세션 아이디는 꼭 쿠키를 사용해서 주고받지 않아도 된다. 하지만 많은 웹 사이트가 쿠키를 사용한다. 쿠키를 사용하는 방법이 제일 간단하기 때문이다. 이 책에서도 쿠키를 사용해 세션 아이디를 주고받는 식으로 실습을 진행할 것이다. 세션을 위해 사용하는 쿠키를 세션 쿠키라고 부른다. 

서비스를 새로 만들 떄마다 쿠키와 세션을 직접 구현할 수는 없다. 게다가 지금 코드로는 쿠키를 악용한 여러 가지 위협을 방어하지도 못한다. 위의 방식 역시 세션 아이디 값이 공개되어 있어 누출되면 다른 사람이 사용할 수 있다. 따라서 절대로 위의 코드를 실제 서비스에 사용해서는 안된다. 

<hr>

### https 와 http2
https 모듈은 웹 서버에 ssl 암호화를 추가한다. get이나 post 요청을 할 때 오가는 데이터를 암호화해서 중간에 다른 사람이 요청을 가로채더라도 내용을 확인할 수 없게 한다. 

https 는 아무나 사용할 수 없다. 암호화를 적용하는 만큼 그것을 인증해줄 수 있는 기관도 필요하기 때문이다. 인증서는 인증 기관에서 구입해야 한다.
발급 과정이 복잡하고 도메인도 필요하므로 인증서를 발급하고, 적용하는 방법은 책에서 보자 !

<hr>

### cluster 
cluster 모듈은 기본적으로 싱글 프로세스로 동작하는 노드가 CPU 코어를 모두 사용할 수 있게 해주는 모듈이다. 포트를 공유하는 노드 프로세스를 여러 개 둘 수도 있으므로, 요청이 많이 들어왔을 때 병렬로 실행된 서버의 개수만큼 요청이 분산되게 할 수 있다. 서버에 무리가 덜 가게 되는 셈이다.

cluster.js
```js
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if(cluster.isMaster) {
    console.log(`마스터 프로세스 아이디: ${process.pid}`);

    for (let i = 0; i < numCPUs; i += 1) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`${worker.process.pid}번 워커가 종료되었습니다.`);
        console.log('code', code, 'signal', signal);
    });
} else {
    http.createServer((req, res) => {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write('<h1>Hello Node</h1>');
        res.end('<p>Hello Cluster</p>');
    }).listen(8080);

    console.log(`${process.pid}번 워커 실행`);
}
```

worker_threads 의 예제와 모양이 비슷하다. 다만 스레드가 아니라 프로세스이다. 클러스터에는 마스터 프로세스와 워커 프로세스가 있다. 마스터 프로세스는 CPU 개수 만큼 워커 프로세스를 만들고, 8080 포트에서 대기한다. 요청이 들어오면 만들어진 워커 프로세스에 요청을 분배한다.

워커 프로세스가 실질적인 일을 하는 프로세스이다.

웹 서버 주소는 HTML 또는 CSS 같은 정적 파일을 요청하는 주소와 서버의 users 자원을 요청하는 주소로 크게 나뉘어져 있다. 만약 파일이나 자원의 수가 늘어나면 그에 따라 주소의 종류도 많아져야 한다. 
그런데 if문이 많아 이미 코드가 상당히 길어져서 보기도 어렵고 관리하기도 어렵다. 주소의 수가 많아질수록 코드는 계속 길어진다. 여기에 쿠키와 세션을 추가하게 되면 더 복잡해질 것이다. Express 모듈을 사용하면 편리하게 만들 수 있다.

<hr>

# 패키지 매니저

### npm 알아보기
npm은 Node Package Manager의 약어로, 이름 그대로 노드 패키지 매니저이다.

대부분의 자바스크립트 프로그램은 패키지라는 이름으로 npm에 등록되어 있으므로 특정 기능을 하는 패키지가 필요하다면 npm에서 찾아 설치하면 된다.

### package.json으로 패키지 관리하기
서비스에 필요한 패키지를 하나씩 추가하다 보면 어느새 패키지 수가 100개를 훌쩍넘어버리게 된다. 그리고 사용할 패키지는 저마다 고유한 버전이 있으므로 어딘가에 기록해두어야 한다. 같은 패키지라도 버전별로 기능이 다를 수 있으므로 프로젝트를 설치할 때 패키지도 동일한 버전을 설치하지 않으면 문제가 생길 수 있다. 이때 설치한 패키지의 버전을 관리하는 파일이 바로 package.json이다.

따라서 노드 프로젝트를 시작하기 전에는 폴더 내부에 무조건 package.json 부터 만들고 시작해야 한다. npm은 package.json을 만드는 명령어를 제공한다.

```
npm init
```

설정은 입맛에 맞게 바꾸고 옵션에 대해 알아보자
- package name : 패키지의 이름이다. package.json의 name 속성에 저장된다.
- version : 패키지의 버전이다. npm의 버전은 다소 엄격하게 관리된다.
- entry point : 자바스크립트 실행 파일 진입점이다. 보통 마지막으로 module.exports를 하는 파일을 지정한다. package.json의 main 속성에 저장된다.
- test command : 코드를 테스트할 때 입력할 명령어를 의미한다. package.json scripts 속성 안의 test 속성에 저장된다.
- git repository : 코드를 저장해둔 깃 저장소 주소를 의미한다.
- keywords : 키워드는 npm 공식 홈페이지에서 패키지를 쉽게 찾을 수 있도록 해준다.
- license : 해당 패키지의 라이선스를 넣으면 된다.

script 부분은 npm 명령어를 저장해두는 부분입니다. 콘솔에서 npm run [스크립트 명령어]를 입력하면 해당 스크립트가 실행된다.

test 스크립트 외에도 scripts 속성에 명령어 여러 개를 등록해두고 사용할 수 있다. 보통 start 명령어에 node [파일명]을 저장해두고 npm start로 실행한다.

이제 패키지를 설치해보죠. 익스프레스를 설치해보겠다. npm install [패키지 이름]을 콘솔에 입력하면 된다.

이렇게 하면 express 패키지가 설치되었다.
- --save 옵션은 dependencies에 패키지 이름을 추가하는 옵션이지만 npm@5부터는 기본값으로 설정되어 있어 있으므로 따로 붙이지 않아도 된다.

설치를 하게 되면 node_modules라는 폴더도 생성되었다. 그 안에 설치하 패키지들이 들어있다. 분명 express 하나만 설치했는데도 패키지가 여러 개 들어있는데 이는 express가 의존하는 패키지들이다. 패키지 하나가 다른 패키지를 그 패키지들이 또 다른 패키지들에 의존한다. 이렇게 의존 관계가 복잡하게 얽혀 있어 package.json이 필요한 것이다.

package-lock.json이라는 파일도 생성되었다. 내용을 보면 직접 설치한 express 외에도 node_modules에 들어 있는 패키지들의 정확한 버전과 의존 관계가 담겨있다. npm으로 패키지를 설치, 수정, 삭제할 때마다 패키지들 간의 내부 의존 관계를 이 파일에 저장한다.

개발 중에만 사용되는 패키지들은 npm install --save-dev [패키지] 로 설치한다. package.json에 새로운 석성이 생겼다. 새로 생긴 devDependencies 속성에서는 개발용 패키지들만 따로 관리한다.

npm 에는 전역 설치라는 옵션도 있다. 패키지를 현재 폴더의 node_modules에 설치하는 것이 아니라 npm이 설치되어 있는 폴더에 설치한다. 이 폴더의 경로를 보통 시스템 환경 변수에 등록되어 있으므로 전역 설치한 패키지는 콘솔의 명령어로 사용할 수 있다. 전역 설치를 했다고 해서 패키지를 모든 곳에서 사용한다는 뜻은 아니다. 대부분 명령어로 사용하기 위해 전역 설치한다.

리눅스나 맥에서는 전역 설치 시에 관리자 권한이 필요하므로 sudo를 앞에 붙여야 한다. 

<hr>

### 패키지 버전 이해하기
노드 패키지들의 버전은 항상 세 자리로 이루어져 있다. 심지어 노드의 버전도 세 자리 이다. 버전이 세 자리인 이유는 SemVer 방식의 버전 넘버링을 따르기 때문입니다.

SemVer란, Semantic versioning 의 약어이다. 버전을 구성하는 세 자리가 모두 의미를 가지고 있다는 뜻 이다.

각각의 패키지는 모두 버전이 다르고 패키지 간의 의존 관계도 복잡하다. 어떤 패키지의 버전을 업그레이드 했는데 에러가 발생한다면 문제가 심각해질 수 있다. 따라서 버전 번호를 어떻게 정하고 올려야 하는지를 명시하는 규칙이 생겼다. 이것이 SemVer이다.

버전의 첫 번째 자리는 major 버전이다. major 버전이 0이면 초기 개발 중이라는 뜻이다. 1 부터는 정식 버전을 의미하며, major 버전은 하위 호환이 안될 정도로 패키지의 내용이 수정 되었을 때 올린다.

버전의 두 번쨰 자리는 minor 버전이다. minor 버전은 하위 호환이 되는 기능 업데이트 할 때 올린다. 

버전의 세 번째 자리는 patch 버전이다. 새로운 기능이 추가되었다기보다는 기존 기능에 문제가 있어 수정한 것으 내놓았을 때 patch 버전을 올린다.

새 버전을 배포한 후에는 그 버전의 내용을 절대 수정하면 안 된다. 만약 수정 사항이 생기면 3 자리중 하나를 의미에 맞게 올려서 새로운 버저능로 배포해야한다. 이렇게 하면 배포된 버전 내용이 바뀌지 않아서 패키지 간 의존 관계에 큰 도움이 되며, 특정 버전이 정상적으로 동작하고 같은 버전을 사용하면 어떠한 경우라도 정상적으로 동작할 것이라 믿을 수 있다.

버전의 숫자마다 의미가 부여되어 있으므로 다른 패키지를 사용할 때도 버전만 보고 에러 발생 여부를 가늠할 수 있다.

- ^ 기호는 minor 버전까지만 설치하거나 업데이트한다.
- ~ 기호는 patch 버전까지만 설치하거나 업데이트한다.
- " >, <, >=, <=, = "은 알기 쉽게 초과, 미만, 이상, 이하, 동일을 뜻한다. 
- @latest는 안정된 가장 최신 버전의 패키지를 설치한다.
- @next를 사요아면 가장 최근 배포판을 설치해서 사용한다. 안정되지 않은 알파나 베타 버전의 패키지를 설치할 수 있다는 것이다.

<hr>

### 기타 npm 명령어
npm으로 설치한 패키지를 사용하다 보면 새로운 기능이 추가되거나 버그를 고친 새로운 버전이 나올 때가 있다. npm outdated 명령어로 업데이트할 수 있는 패키지가 있는지 확인해보면 된다.

Current 와 Wanted 가 다르다면 업데이트가 필요한 경우이다. 이럴 때는 npm update [패키지명] 으로 업데이트할 수 있다. 

npm uninstall [패키지명]은 패키지가 node_modules와 package.json에서 사라진다. rm으로 줄여 쓸 수 있다. 

npm search [검색어]로 패키지를 검색할 수 있다. 윈도나 맥에서는 브라우저를 통해 npm 공식 사이트에서 검색하면 편리할 것이다.

npm info [패키지명]은 패키지의 세부 정보를 파악하고자 할 때 사용하는 명령어이다. package.json의 내용과 의존 관계, 설치 가능한 버전 정보 등이 표시된다.

npm adduser 는 npm 로그인을 위한 명령어이다. npm 공식 사이트에서 가입한 계졍으로 로그인하면 된다. 나중에 패키지를 배포할 때 로그인이 필요하다. 

npm whoami 는 로그인한 사용자가 누구인지 알린다. 로그인된 상태가 아니라면 에러가 발생한다.

npm logout 은 npm adduser로 로그인한 계정을 로그아웃할 때 사용한다.

npm version [버전] 명령어를 사용하면 package.json 버전을 올린다. 원하는 버전의 숫자를 너흥며 ㄴ된다.

npm deprecate [패키지명][버전][메시지]는 해당 패키지를 설치할 때 경고 메시지를 띄우게 하는 명령어이다. 자신의 패키지에만 이 명령어를 적용할 수 있다.

npm publish 는 자신이 만든 패키지를 제거할 때 사용한다. 24시간 이내에 배포한 패키지만 제거할 수 있다.

npm ci는 package.json 대신 package-lock.json 에 기반하여 패키지를 설치한다.

이 외의 명령어는 공식 사이트에서 확인하길 바란다.

배포와 관련된 명령어와 방법은 교재 224쪽에 있다.

<hr>

# 익스프레스 웹 서버 만들기
익스프레스는 http 모듈의 요청과 응답 객체에 추가 기능들을 부여했다. 기존 메서드들도 계속 사용할 수 있지만, 편리한 메서드들을 추가하여 기능을 보완했다. 또한 코드를 분리하기 귑세 만들어 관리하기도 용이하다. 그리고 더 이상 if문으로 요청 메서드와 주소를 구별하지 않아도 된다.

### 익스프레스 프로젝트 시작하기
package.json을 먼저 생성하고 script부분에 start 속성은 잊지 말고 넣어줘야 한다. nodemon app이라는 속성은 app.js은 nodemon 으로 실행한다는 뜻이다. 서버 코드에 수정 사항이 생길 때마다 매번 서버를 재시작 하기는 귀찮으므로 nodemon 모듈로 서버를 자동으로 재시작 한다. 앞으로 서버 코드를 수정하면 nodemon이 서버를 자동으로 재시작 한다. 

express 모듈을 실행해 app 변수에 할당한다. 익스프레스 내부에 http 모듈이 내장되어 있으므로 서버의 역할을 할 수 있다.

app.set('port', 포트) 로 서버가 실행될 포트를 설정한다. process.env 객체에 port 속성이 있다면 그 값을 사용하고, 없다면 기본값으로 3000번 포트를 이요하도록 되어 있다. 이렇게 app.set(키, 값)을 사용해서 데이터를 저장할 수 있다. 나중에 데이터를 app.get(키)로 가져올 수 있다. 

app.get(주소,라우터)는 주소에 대한 GET 요청이 올 때 어떤 동작을 할지 적는 부분이다. 매개 변수 req는 요청에 관한 정보가 들어 있는 객체이고, res는 응답에 관한 정보가 들어 있느 객체 이다. 익스프레스에서는 res.write나 res.end 대신 re

GET 요청외에도 POST, PUT, PATCH, DELETE, OPTIONS 에 대한 라우터를 위한 app.post, app.put, app.patch, app.delete, app.options 메서드가 존재한다.

### 자주 사용하는 미들웨어
(교재 글)
미들웨어는 익스프레스의 핵심이다. 요청과 응답의 중간에 위치하여 미들웨어라고 부른다. 뒤에 나오는 라우터와 에러 핸들러 또한 미들웨어의 일종이므로 미들웨어가 익스프레스의 전부라고 해도 과언이 아니다. 미들웨어는 요청과 응답을 조작하여 기능을 추가하기도하고, 나쁜 요청을 걸러내기도 한다.

미들웨어는 app.use와 함께 사용된다. app.use(미들웨어) 꼴이다. 익스프레스 서버에 미들웨어를 연결을 해본다.

app.use에 매개변수가 req, res, next인 함수를 넣으면 된다. 미들웨어는 위에서부터 아래로 순서대로 실행되면서 요청과 응답 사이에 특별한 기능을 추가할 수 있다. next라는 세번째 매개변수를 사용했는데, 다음 미들웨어로 넘어가는 함수이다. next를 실행하지 않으면 다음 미들웨어가 실행되지 않는다. 

주소를 첫 번째 인수에 넣어주지 않는다면 미들웨어는 모든 요청에서 실행되고, 주소를 넣는다면 해당하는 요청에서만 실행된다고 보면 된다.

- app.use(미들웨어) : 모든 요청에서 미들웨어 실행
- app.use('/abc', 미들웨어) : abc로 시작하는 요청에서 미들웨어 실행
- app.post('/abc', 미들웨어) : abc로 시작하는 POST 요청에서 미들웨어 실행

app.use나 app.get 같은 라우터에 미들웨어를 여러 개 장착할 수 있다. 

에러 처리 미들웨어는 매개변수가 err, req, res, next 가 네 개 이다. 모든 매개변수를 사용하지 않더라도 매개변수가 반드기 네 개여야 한다. 첫 번째 매개변수 err에는 에러에 관한 정보가 담겨 있다. res.status 메서드로 HTTP 상태 코드를 지정할 수 있다. 기본값은 200으로 에러 처리 미들웨어를 직접 연결하지 않아도 기본적으로 익스프레스가 에러를 처리하긴 한다. 하지만 실무에서는 직접 에러 처리 미들웨어를 연결해주는 것이 좋다. 에러 처리 미들웨어는 특별한 경우가 아니면 가장 아래에 위치하도록 한다. 

실무에서 자주 사용하는 패키지
```
$ npm i morgan cookie-parser express-session dotenv
```

dotenv를 제외한 다른 패키지들은 미들웨어이다.

app.js
```js
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
app.use('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized : false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly : true,
        secure: false
    },
    name: 'session-cookie'
}));

app.use((req, res, next) => {
    console.log('모든 요청에 다 실행된다.')
    next();
});
```

.env
```env
COOKIE_SECRET = cookiesecret
```

설치했던 패키지들을 불러온 뒤 app.use에 연결한다. req, res, next 같은 것들이 보이지않아 당황스러울 수도 있는데, 미들웨어 내부에 들어 있다. next도 내부적으로 호출하기에 다음 미들웨어로 넘어갈 수 있다.

dotenv 패키지는 .env 파일을 읽어서 process.env로 만든다. dotenv 패키지의 이름이 dot + env 인 이유이다. process.env.COOKIE_SECRET에 cookiesecret 값이 할당된다. 키 = 값 형식으로 추가하면 된다. process.env를 별도의 파일로 관리하는 이유는 보안과 설정의 편의성 때문이다. 비밀 키들을 소스 코드에 그대로 적어두면 소스코드가 유출되었을 때 키도 같이 유출된다. 따라서 .env 같은 별도의 파일에 비밀 키를 적어두고 dotenv 패키지로 비밀 키를 로딩하는 방식으로 관리하곤 한다. 소크 코드가 유출되더라도 .env 파일만 잘 관리하면 비밀 키는 지킬 수 있다.

### morgan
morgan 미들웨어는 app.use(margan('dev')) 이런식으로 사용한다.

인수로 dev 외에 combined, common, short, tiny 등을 넣을 수 있다. 인수를 바꾸면 로그가 달라지니 직접 테스트 해보면 알 수 있다. 

### static
static 미들웨어는 정적인 파일들을 제공하는 라우터 역할을 한다. 기본적으로 제공되기에 따로 설치할 필요 없이 express 객체 안에서 꺼내 장착하면 된다.

```js
app.use('요청 경로', express.static('실제 경로'));

app.use('/', express.static(path.join(__dirname, 'public')));
```

함수의 인수로 정적 파일들이 담겨 있는 폴더를 지정하면 된다. 실제 서버의 폴더 경로에는 public이 들어 있지만 요청 주소에는 public이 들어 있지 않다는 점을 주목하자, 서버의 폴더 경로와 요청 경로가 다르므로 외부인이 서버의 구조를 쉽게 파악할 수 없다. 이는 보안에 큰 도움이 된다. 

또한, 정적 파일들을 알아서 제공해주므로 fs.readFile로 파일을 직접 읽어서 전송할 필요가 없다. 만약 요청 경로에 해당하는 파일이 없으면 알아서 내부적으로 next를 호출한다. 만약 파일을 발견했다면 다음 미들웨어는 실행되지 않는다. 응답으로 파일을 보내고 next를 호출하지 않기 때문이다.

###  body-parser
요청의 본문에 있는 데이터를 해석해서 req.body 객체로 만들어주는 미들웨어이다. 보통 폼 데이터나 ajax 요청의 데이터를 처리한다. 단, 멀티파트 데이터는 처리하지 못한다. 그 경우에는 뒤에 나오는 multer 모듈을 사용하면 된다.

```js
app.use(express.json());
app.use(express.urlencoded({extended : false}));
```

body-parser 미들웨어의 일부 기능이 익스프레스에 내장되었으므로 따로 설치할 필요가 없다.

단, 직접 설치해야되는 경우도 있는데 body-parser는 json과 url-encoded 형식의 데팅터 외에도 Raw, Text 형식의 데이터를 추가로 해석할 수 있다.

Raw는 요청의 본문이 버퍼 데이터일 때, Text는 텍스트 데이터일 때 해성하는 미들웨어이다. 버퍼나 텍스트 요청을 처리할 필요가 있다면 body -parser를 설치한 후에 추가해주면 된다

```js
const bodyParser = require('body-parser');
app.use(bodyParser.raw());
app.use(bodyParser.text());
```

JSON은 JSON 형식의 데이터 전달 방식이고, URL-encoded는 주소 형식으로 데이터를 보내는 방식이다. 폼 전송은 URL-encoded 방식을 주로 사용한다. urlencoded 메서드를 보면 {extended : false} 라는 옵션이 들어 있다. 이 옵션이 false 면 노드의 querystring 모듈을 사용하여 쿼리스트링을 해석하고, true면 qs 모듈을 사용하여 쿼리스트링을 해석한다. qs 모듈은 내장 모듈이 아니라 npm 패키지 이며, querystring 모듈의 기능을 좀 더 확장한 모듈이다.

### cookie-parser
cookie-parser는 요청에 동봉된 쿠키를 해석해 req.cookies 객체로 만든다. 

```js
app.use(cookieParser(비밀키));
```

해석된 쿠키들은 req.cookies 객체에 들어간다. 예를 들어 name=zerocho 쿠키를 보냈다면 req.cookies 는 { name: 'zerocho'} 가 된다. 

첫 번째 인수로 비밀 키를 넣어줄 수 있다. 서명된 쿠키가 있는 경우, 제공한 비밀 키를 통해 해당 쿠키가 내 서버가 만든 쿠키임을 검증할 수 있다. 쿠키는 클라이언트에서 위조하기 쉬우므로 비밀 키를 통해 만들어낸 서명을 쿠키 값 뒤에 붙인다. 서명이 붙으면 쿠키가 name.zerocho.sign과 같은 모양이 된다. 서명된 쿠키는 req.cookies 대신 req.signedCookies 객체에 들어 있다.

cookie-parser가 쿠키를 생성할 때 쓰이는 것은 아니다. 쿠키를 생성/제거하기 위해서는 res.cookie, res.clearCookie 메서드를 사용해야 한다. res.cookie(키, 값, 옵션) 형식으로 사용한다.

쿠키를 지우려면, 키와 값 외에 옵션도정확히 일치해야 쿠키가 지워진다. 단, expires나 maxAge 옵션은 일치할 필요가 없다.

옵션 중에는 signed라는 옵션이 있는데, 이를 true로 설정하면 쿠키 뒤에 서명이 붙는다. 내 서버가 쿠키를 만들었다는 것을 검증할 수 있으므로 대부분의 경우 서명 옵션을 켜두는 것이 좋다. 서명을 위한 키는 cookieParser 미들웨어에 인수로 넣은 process.env.COOKIE_SECRET 이 된다.

### express-session

세션 관리용 미들웨어 이다. 로그인 등의 이유로 세션을 구현하거나 특정 사용자를 위한 데이터를 임시적으로 저장해둘 때 매우 유용하다. 세션은 사용자별로 req.session 객체 안에 유지된다.

express-session은 인수로 세션에 대한 설정을 받는다. resave는 요청이 올 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지 설정하는 것이고, saveUninitialized는 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정하는 것이다. 현재는 둘 다 필요 없으므로 false로 했다.

express-session은 세션 관리 시 클라이언트에 쿠키를 보낸다. 안전하게 쿠키를 전송하려면 쿠키세 서명을 추가해야 하고, 쿠키를 서명하는 데 secret 의 값이 필요하다. cookie-parser의 secret과 같게 설정하는 것이 좋다. 세션 쿠키의 이름은 name 으로 설정한다. 기본 이름은 connect.sid 이다.

cookie 옵션은 세션 쿠키에 대한 설정이다. maxAge, domain, path, expires, sameSite, httpOnly, secure 등 일반적인 쿠키 옵션이 모두 제공된다. 배포 시에는 https를 적용하고 secure도 true로 설정하는 것이 좋다.

express-session으로 만들어진 req.session 객체에 값을 대입하거나 삭제해서 세션을 변경할 수 있다. 나중에 세션을 한 번에 삭제하려면 req.session.destroy 메서드를 호출하면 된다. 현재 세션의 아이디는 req.sessionID로 확인할 수 있다. 세션을 강제로 저장하기 위해 req.session.save 메서드가 존재하지만, 일반적으로 요청이 끝날 때 자동을 ㅗ호출되므로 직접 save 메서드를 호출할 일은 거의 없다.

### 미들웨어의 특성 활용하기
미들웨어는 req, res, next 를 매개변수로 가지는 함수로서 app.use, app.get, app.post 등으로 장착한다. 특정한 주소의 요청에만 미들웨어가 실행되게 하려면 첫 번째 인수로 주소를 넣으면 된다. 

next를 호출하지 않는 미들웨어는 res.send나 res.sendFile 등의 메서드로 응답을 보내야 한다. express.static 과 같은 미들웨어는 정적 파일을 제공할 때 next 대신 res.sendFile 메서드로 응답을 보낸다. 따라서 정적 파일을 제공하는 경우 express.json, express.urlencoded, cookieParser 미들웨어는 실행되지 않는다. 미들웨어 장착 순서에 따라 어떤 미들웨어는 실행되지 않을 수도 있다.

next 함수에 인수를 넣을 수도 있다. 단, 인수를 넣는다면 특수한 동작을 하는데 route라는 문자열을 넣으면 다음 라우터의 미들웨어로 바로 이동하고, 그 외의 인수를 넣는다면 바로 에러 처리 미들웨어로 이동한다. 이때의 인수는 에러 처리 미들웨어의 err 매개변수가 된다. 라우터에서 에러가 발생할 때 에러를 next(err)을 통해 에러 처리 미들웨어로 넘긴다.

미들웨어 간에 데이터를 전달하는 방법도 있다. 세션을 사용한다면 req.session 객체에 데이터를 넣어도 되지만, 세션이 유지되는 동안에 데이터도 계속 유지된다는 단점이 있다. 만약, 요청이 끝날 때까지만 데이터를 유지하고 싶다면 req 객체에 데이터를 넣어두면 된다.

### multer
이미지, 동영상 등을 비롯한 여러 가지 파일들을 멀티파트 형식으로 업로드할 때 사용하는 미들웨어이다. 멀티파트 형식이란 다음과 같이 enctype이 multipart/form-data 인 폼을 통해 업로드하는 데이터의 형식을 의미한다.

멀티파트 형식으로 업로드하는 데이터는 개발자 도구 network 탭에서 form data 형식으로 보인다. 이러한 폼을 통해 업로드하는 파일은 body-parser 로는 처리할 수 없고 직접 파싱하기도 어려우므로 multer라는 미들웨어를 따로 사용하면 편리하다.

```js
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
```

multer 함수의 인수로 설정을 넣는다. storage 속성에는 어디에 어떤 이름으로 저장할지를 넣는다. destination 과 filename 함수의 req 매개변수에는 요청에 대한 정보가, file 객체에는 업로드한 파일에 대한 정보가 있다. done 매개변수는 함수이다. 첫 번째 인수에는 에러가 있다면 에러를 넣고, 두 번째 인수에는 실제 경로나 파일 이름을 넣어주면 된다. req나 file의 데이터를 가공해서 done 으로 넘기는 형식이다.

현재 설정으로는 uploads라는 폴더에 [파일명 + 현재시간.확장자] 파일명으로 업로드하고 있다. 현재 시간을 넣어주는 이유는 업로드하는 파일명이 겹치는 것을 막기 위해서 이다.

limits 속성에는 업로드에 대한 제한 사항을 설정할 수 있다. 파일사이즈는 5mb 로 제한해두었다.

다만 위 설정을 실제로 활용하기 위해서는 서버에 uploads 폴더가 꼭 존재해야 한다. 없다면 직접 만들어주거나 다음과 같이 fs 모듈을 사용해서 서버를 시작할 때 생성한다.
```js
try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}
```
설정이 끝나면 upload 변수가 생기는데, 여기에 다양한 종류의 미들웨어가 들어있다. 

먼저 파일을 하나만 업로드하는 경우에는 single 미들웨어를 사용한다.

single 미들웨어를 라우터 미들웨어 앞에 넣어두면, multer 설정에 따라 파일 업로드 후 req.file 객체가 생성된다. 인수는 input 태그의 name이나 폼 데이터의 키와 일치하게 넣으면 된다. 업로드 성공 시 결과는 req.file 객체 안에 들어 있다. req.body에는 파일이 아닌 데이터인 title이 들어 있다.

<hr>

## Router 객체로 라우팅 분리하기 

익스프레스를 사용하는 이유 중 하나는 바로 라우팅을 깔끔하게 관리할 수 있다는 점이다.

app.js에서 app.get 같은 메서드가 라우터 부분이다. 라우터를 많이 연결하면 app.js 코드가 매우 길어지므로 익스프레스에서는 라우터를 분리할 수 있는 방법을 제공한다. routes 폴더를 만들고 그 안에 index.js와 user.js를 작성한다.

index.js & user.js
```js
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello, Express || User');
});

module.exports = router;
```

만들었던 index.js와 user.js를 app.use를 통해 app.js에 연결한다. 또한, 에러 처리 미들웨어 위에 404 상태 코드를 응답하는 미들웨어를 하나 추가한다.

```js
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const indexRouter = require('./routes');
const userRouter = require('./routes/user');

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  name: 'session-cookie',
}));

app.use('/', indexRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
```

indexRouter를 ./routes할 수 있는 이유는 index.js는 생략할 수 있기 때문이다. require('./routes/index.js')와 require('./routes')는 같다.

index.js와 user.js 는 모양이 거의 비슷하지만, 다른 주소의 라우터 역할을 하고 있다. app.use로 연결할 때의 차이 때문이다. indexRouter는 app.use('/')에 연결했고, userRouter는 app.use('/user')에 연결했다. indexRouter는 use의 '/'와 get의 '/'가 합쳐져 GET / 라우터가 되었고, userRouter는 use의 '/user'와 get의 '/'가 합쳐져 GET /user 라우터가 되었다. 이렇게 app.use로 연결할 때 주소가 합쳐진다는 것을 염두하고 있으면 된다.

같은 주소의 라우터를 여러 개 만들어도 된다. 라우터가 몇 개든 간에 next()를 호출하면 다음 미들웨어가 실행된다. 라우터 주소에는 정규표현식을 비롯한 특수 패턴을 사용할 수 있다. 여러 가지 패턴이 있지만 라우트 매개변수라고 불리는 패턴에 대해서 알아보겠다.

```js
router.get('/user/:id', function(req, res) {
    console.log(req.params, req.query);
})
```
주소에 :id가 있는데, 문자 그대로 :id를 의미하는 것이 아니다. 이 부분에는 다른 값을 넣을 수 있다. :id에 해당하는 값을 조회할 수 있다는 것이 장점이며, req.params 객체 안에 들어있다.

단, 이 패턴을 사용할 때 일반 라우터보다 뒤에 위치해야 한다. 다양한 라우터를 아우르는 와일드 카드 역할을 하므로 일반 라우터보다는 뒤에 위치해야 다른 라우터를 방해하지 않는다.

app.js에서 에러 처리 미들웨어 위에 넣어둔 미들웨어는 일치하는 라우터가 없을 때 404 상태 코드를 응답하는 역할을 한다. 미들웨어가 존재하지 않아도 익스프레스가 자체적으로 404 에러를 처리해주기는 하지만, 웬만하면 404 응답 미들웨어와 에러 처리 미들웨어를 연결해주는 것이 좋다. 


### req, res 객체 살펴보기

익스프레스의 req, res 객체는 http 모듈의 req, res 객체를 확장한 것이다. 기존 http 모듈의 메서드를 사용할 수 있거, 익스프레스가 추가한 메서드나 속성을 사용할 수 있다.
- req.app : req 객체를 통해 app 객체에 접근할 수 있다. req.app.get('port')와 같은 식으로 사용할 수 있다.
- req.body : body-parser 미들웨어가 만드는 요청의 본문을 해석한 객체이다.
- req.cookies : cookike-parset각 미들웨어가 만드는 요청의 쿠키를 해석한 객체이다.
- req.ip : 요청의 ip 주소가 담겨 있다.
- req.params : 라우트 매개변수에 대한 정보가 담긴 객체이다.
- req.query : 쿼리스트링에 대한 정보가 담긴 객체이다.
- req.signedCookies : 서명된 쿠키들은 req.cookies 대신 여기에 담겨 있다.
  
res 객체도 알아보자

- res.app : req.app 처럼 res 객체를 통해 app 객체에 접근할 수 있다.
- res.cookie (키, 값, 옵션) : 쿠키를 설정하는 메서드이다.
- res.clearCookie(키, 값, 옵션) : 쿠키를 제거하는 메서드이다.
- res.end() : 데이터 없이 응답을 보낸다.
- res.json(JSON) : JSON 형식의 응답을 보낸다.
- res.redirect(주소) : 리다이렉트할 주소와 함께 응답을 보낸다.
- res.render(뷰, 데이터) : 템플릿 엔진을 렌더링해서 응답할 때 사용하는 메서드이다.
- res.send(데이터) : 데이터와 함께 응답을 보낸다. 데이터는 문자열일 수도 있고 HTML일 수도 있으며, 버퍼일 수도 있고 객체나 배열일 수도 있다.
- res.sendFile(경로) : 경로에 위치한 파일을 응답한다.
- res.set(헤더, 값) : 응답의 헤더를 설정한다.
- res.status(코드) : 응답 시의 http 상태 코드를 지정한다.

req나 res 객체의 메서드는 메서드 체이닝을 지원하는 경우가 많다. 메서드 체이닝을 사용하면 코드 길이를 줄일 수 있다.

### 템플릿 엔진 사용하기
(교재 내용)
HTML로 1,000 개나 되는 데이터를 모두 표현하고 싶다면 일일이 직접 코딩해서 넣어야 합니다. 자바스크립트로 표현하면 반복문으로 간단하게 처리할 수 있는데 말이죠. 템플릿 엔진은 자바스크립트를 사용해서 HTML을 렌더링할 수 있게 합니다. 따라서 기존 HTML과는 문법이 살짝 다를 수도 있고, 자바스크립트 문법이 들어 있기도 합니다.

이번에는 퍼그와 넌적스에 대해 알아봅니다. 앞으로의 예제는 넌적스를 사용합니다.

#### 퍼그(제이드)
예전 이름인 제이드로 더 유명한 퍼그는 꾸준한 인기를 얻고 있습니다. 문법이 간단하므로 코드의 양이 줄어들기 때문입니다. 루비를 사용해봤다면 문법이 비슷해 금방 적응할 겁니다. 물론 문법이 쉬워서 루비를 모르는 사람도 빠르게 배울 수 있습니다. 단, HTML과는 문법이 많이 달라 호불호가 갈립니다.

```
$ npm i pug
```

views는 템플릿 파일들이 위치한 폴더를 지정하는 것이다. res.render 메서드가 이 폴더 기준으로 템플릿 엔진을 찾아서 렌더링한다. res.render('index') 라면 views/index.pug 를 렌더링 한다. res.render('admin/admin') 이라면 views/admin/main.pug를 렌더링 한다.

view engine은 어떠한 종류의 템플릿 엔진을 사용할지를 나타낸다. 현재 pug로 설정되어 있으므로 그대로 사용하면 된다.

#### HTML 표현
기존 HTML과 다르게 화살괄호와 닫는 태그가 없다. 탭 또는 스페이스로만 태그의 부모 자식 관계를 규명한다. 탭 한 번, 스페이스 두번 또는 스페이스 네 번 모두 상관없다. 모든 파일에 동일한 종류의 들여쓰기를 적용하면 된다. 자식 태그는 부모 태그보다 들여쓰기되어 있어야 한다. 들여쓰기에 오류가 있으면 제대로 렌더링 되지 않으니 주의해야 한다.

```pug
doctype html
html
  head
    title=title
    link(rel='stylesheet', href='/stylesheet/style.css')
```

속성 중 아이디와 클래스가 있는 경우에는 
```pug
#login-button
.post-image
span#highlight
p.hidden.full
```
이렇게 표현한다. div의 경우 생략 가능하다.

HTML 텍스트는 
```pug
p Welcome to Express
button(type='submit') 전송
```
이렇게 한 칸 띄고 입력하면 된다.

에디터에서 텍스트를 여러 줄 입력하고 싶다면 |(파이프) 를 넣으면 된다
```pug
p
  | 안녕하세요
  | 여러 줄을 입력합니다
  br
  | 태그도 중간에 넣을 수 있습니다.
```
여러 줄을 작성해도 HTML 코드에서는 한 줄로 나온다.

style이나 script 태그로 css 또는 자바스크립트 코드를 작성하고 싶다면 
```pug
style.
  h1 {
      font-size: 30px;
  }

script.
  const message = 'Pug';
  alert(message);
```

#### 변수
HTML 과 다르게 자바스크립트 변수를 템플릿에 렌더링할 수 있다. res.render 호출 시 보내는 변수를 퍼그가 처리한다.

```js
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});
```

res.render(템플릿, 변수 객체)는 익스프레스가 res 객체에 추가한 템플릿 렌더링을 위한 메서드이다. index.pug 를 html 로 렌더링 하면서 {title : 'Express'} 라는 객체를 변수로 집어넣는다. layout.pug와 index.pug의 title 부분이 모두 Express로 치환된다. 즉, HTML에도 변수를 사용할 수 있게 된 셈이다.

res.render 메서드에 두 번째 인수로 변수 객체를 넣는 대신, res.locals 객체를 사용해서 변수를 넣을 수도 있다. 
```js
router.get('/', function(req, res, next) {
    res.locals.title = 'Express';
    res.render('index');
})
```
위와 같이 하면 템플릿 엔진이 res.locals 객체를 읽어서 변수를 집어 넣는다. 이 방식의 장점은 현재 라우터뿐만 아니라 다른 미들웨어에서도 res.locals 객체에 접근할 수 있다는 것이다. 따라서 다른 미들웨어에서 템플릿 엔진용 변수를 미리 넣을 수도 있다.

퍼그에서 변수를 사용하는 방법
```pug
h1 = title
p Welcome to #{title}
button(class=title, type='submit') 전송
input(placeholder=title + ' 연습')
```

서버로부터 받은 변수는 다양한 방식으로 퍼그에서 사용할 수 있다. 변수를 텍스트로 사용하고 싶다면 태그 뒤에 =을 붙인 후 변수를 입력한다. 속성에도 =을 붙인 후 변수를 사용할 수 있다. 텍스트 중간에 변수를 넣으려면 #{변수}를 사용하면 된다. 그러면 변수가 그 자리에 들어간다. #{} 의 내부와 = 기호 뒷 부분은 자바스크립트로 해석하므로 input 태그의 경우처럼 자바스크립트 구문을 써도 된다.

서버에서 데이터를 클라이언트로 내려보낼 때 #{}와 = 을 매우 빈번하게 사용한다.

내부에 직접 변수를 선언할 수도 있다. 빼기를 먼저 입력하면 뒤에 자바스크립트 구문을 작성할 수 있다. 여기에 변수를 선언하면 다음 줄부터 해당 변수를 사용할 수 있다.

``` pug
- const node = 'Node.js'
- const js = 'Javascript'
p #{node}와 #{js}
```

퍼그는 기본적으로 변수의 특수 문자를 HTML 엔티티로 이스케이프한다. 이스케이프를 원하지 않는다면 = 대신 !=을 사용하면 된다.

``` pug
p= '<strong>이스케이프</strong>'
p!= '<strong>!이스케이프</strong>'
```

#### 반복문
HTML 과 다르게 반복문도 사용할 수 있으며, 반복 가능한 변수인 경우에만 해당된다.

each 문으로 반복문을 돌릴 수 있다.

```pug
ul
  each fruit in ['사과','배','오렌지']
    li= fruit
```

반복문 사용 시 인덱스도 가져올 수 있다.

#### 조건문
조건문으로 편리하게 분기 처리할 수 있다. if, else if, else를 사용할 수 있다. 

```pug
if isLoggedIn
  div 로그인 되었습니다.
else
  div 로그인이 필요합니다.
```

case 문도 가능하다.
```pug
case fruit
  when 'apple'
    p 사과이다.
  when 'orange'
    p 오렌지다
  when 'banana'
    p 바나나다
```

#### include 
다른 퍼그나 HTML 파일을 넣을 수 있다.
헤더나 푸터, 내비게이션처럼 웹 제작 시 공통되는 부분을 따로 관리할 수 있어 매 페이지마다 동일한 HTML을 넣어야 하는 번거로움을 없앤다. include 파일 경로를 사용한다.

#### extends 와 block 
레이아웃을 정할 수 있다. 공통되는 레이아웃 부분을 따로 관리할 수 있어 좋다. include와도 함께 사용하곤 한다.
```pug
extends layout

block content
  main
    p 내용입니다.

block script
  script(src="main.js")
```
레이아웃이 될 파일에는 공통된 마크업을 넣되 페이지마다 달라지는 부분을 block으로 비워둔다. block은 여러 개 만들어도 된다. block은 block [블록명]으로 선언한다.

block이 되는 파일에서는 extends 키워드로 레이아웃 파일을 지정하고 block 부분을 넣는다. block 선언보다 한 단계 더 들여쓰기되어 있어야 한다. 나중에 익스프레스에서 res.render('body')를 사용해 하나의 HTML로 합쳐 렌더링할 수 있다. 퍼그 확장자는 생략 가능하다. block 부분이 서로 합쳐진다.

### 넌적스
넌적스는 퍼그의 HTML 문법 변화에 적응하기 힘든 분에게 적합한 템플릿 엔진이며, 파이어폭스를 만든 모질라에서 만들어졌다.

```
$ npm i nunjucks
```

넌적스는 퍼그와는 연결 방법이 다소 다르다. configure의 첫 번째 인수로 views 폴더의 경로를 넣고, 두 번째 인수로 옵션을 넣는다. 이 때 express 속성에 app 객체를 연결한다. watch 옵션이 true이면 HTML 파일이 변경될 때 템플릿 엔진을 다시 렌더링한다.

파일은 퍼그와 같은 특수한 확장자 대신 html을 그대로 사용해도 된다. 넌적스임을 구분하려면 확장자로 njk를 쓰면 된다. 단, 이때는 view engine도 njk로 바꿔야 한다.

### 변수
res.render 호출 시 보내는 변수를 넌적스가 처리한다. routes/index.js의 코드를 보면
```js
router.get('/', function(req, res, next) {
    res.render('index', {title : 'Express'})
})
```
넌적스에서 변수는 {{}}로 감싼다.

내부에 변수를 사용할 수도 있다. 변수를 선언할 때는 {% set 변수 = '값' %}를 사용한다.

HTML 을 이스케이프 하고 싶지 않다면 {{변수 | safe}}를 사용한다.

#### 반복문
넌적스에서는 특수한 구문을 {%%} 안에 쓴다.따라서 반복문도 이 안에 넣으면 된다. for in문과 endfor 사이에 위치하면 된다.
```njk
<ul>
    {% set fruits = ['사과','배','오렌지']%}
    {% for item in fruits%}
    <li>{{item}}</li>
    {% endfor %}
</ul>
```

인덱스의 경우 loop.index라는 특수한 변수를 사용할 수 있다.

#### 조건문
조건문은 {% if %} 등 으로 이루어져 있다.

#### include 
다른 html 파일을 넣을 수 있다.
헤더나 푸터, 내비게이션 처럼 웹 제작 시 공통되는 부분을 따로 관리할 수 있어 매 페이지마다 동일한 HTML을 넣어야 하는 번거로움을 없앤다. include 파일 경로로 사용한다. 
```html
{% include "header.html" %}
<main>
    <h1>메인 파일</h1>
    <p>다른 파일을 include 할 수 있다.</p>
</main>
{% include "footer.html" %}
```

#### extends 와 block
레이아웃을 정할 수 있다. 공통되는 레이아웃 부분을 따로 관리할 수 있어 좋다. include와도 함께 사용되곤 한다.

레이아웃이 될 파일에은 공통된 마크업을 넣되, 페이지마다 달라지는 부분을 block으로 비워둔다. block은 여러 개 만들어도 된다. block을 선언하는 방법은 {% block [블록명]%}이다. {% endblock %}로 블록을 종료한다.

block이 되는 파일에서는 {% extends 경로 %} 키워드로 레이아웃 파일을 지정하고 block 부분을 넣는다. 나중에 익스프레스에서 res.render('body')를 사용해 하나의 HTML로 합친 후 렌더링할 수 있다. 같은 이름의 block 부분이 서로 합쳐진다.

### 에러 처리 미들웨어
