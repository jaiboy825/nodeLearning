# 노드공부 , 대부분의 글은 교재에 있는 글을 좀 추리면서 작성한 것으로 중간중간에 생각을 적었습니다.

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

process.env는 서비스의 중요한 키를 저장하는 공간으로도 사용되기에 서버나 데이터베이스의 비밀번호와 각종 API 키를 코드에 직접 입력하는 것은 위험하다. 따라서 중요한 비밀번호는 process.env의 속성에 넣어두는 것이 안전하다.
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
에러 처리 미들웨어는 error 라는 템플릿 파일을 렌더링한다. 렌더링 시 res.locals.message 와 res.locals.error에 넣어준 값을 함께 렌더링 한다. res.render에 변수를 대입하는 것 외에도 res.locals 속성에 값을 대입하여 템플릿 엔진 변수를 주입할 수 있다.

error 객체의 스택 트레이스는 시스템 환경이 production이 아닌 경우에만 표시된다. 배포 환경인 경우에는 에러 메시지만 표시된다. 에러 스택 트레이스가 노출되면 보안에 취약할 수 있기 때문이다. 

<hr>

# MySQL
(저자의 말) 위 내용까지는 모든 데이터를 변수에 저장했습니다. 변수에 저장했다는 것은 컴퓨터 메모리에 저장했다는 뜻입니다. 서버가 종료되면 메모리가 정리되면서 저장했던 데이터도 사라져버립니다. 이를 방지하기 ㅜ이해서는 데이터베이스를 사용해야 합니다. 

다양한 데이터베이스가 있지만, 이 책에서는 MySQL과 몽고디비를 사용합니다. MySQL은 SQL 언어를 사용하는 관계형 데이터베이스 관리 시스템의 대표 주자고, 몽고디비는 NoSQL의 대표 주자입니다.

### 데이터베이스란
데이터베이스는 관련성을 가지며 중복이 없는 데이터들의 집합이다. 이러한 데이터베이스를 관리하는 시스템을 DBMS라고 부른다. 보통 서버의 하드 디스크나 SSD 등의 저장 매체에 데이터를 저장한다. 저장 매체가 고장나거나 사용자가 직접 데이터를 지우지 않는 이상 계속 데이터가 보존되므로 서버 종료 여부와 상관없이 데이터를 지속적으로 사용할 수 있다.

또한, 서버에 데이터베이스를 올리면 여러 사람이 동시에 사용할 수 있다. 사람들에게 각각 다른 권한을 줘서 어떤 사람은 읽기만 가능하고, 어떤 사람은 모든 작업을 가능하게 할 수 있다.

데이터베이스를 관리하는 DBMS 중에서 RDBMS라고 부르는 관계형 DBMS가 많이 사용된다. 대표적인 RDBMS로는 Oracle, MySQL, MSSQL 등이 있다. 이들은 SQL 이라는 언어를 사용해 데이터를 관리한다. 하지만 RDBMS 별로 SQL 문이 조금씩 다르다.

### MySQL 설치하기
#### 윈도우 
MySQL 의 공식 사이트 (https://dev.mysql.com/downloads/installer/)에서 Download 버튼을 눌러 인스톨러를 내려 받고 비밀번호 버전 등의 선택 후 설치를 하면 된다.

#### 맥

```
$ brew install mysql
$ brew services start mysql
$ mysql_secure_installation
```

만약 brew servicdes start mysql 에서 bootstrap 에러가 나온다면 서비스를 멈추고, 삭제 후 재 설치
```
$ brew services stop mysql
$ brew uninstall mysql
$ rm -rf /usr/local/var/mysql
$ rm /usr/local/etc/my.cnf
```
이렇게 작성하면 깔끔하게 mysql을 삭제할 수 있다. 이후 재 설치

mysql_secure_installation 을 입력하고 비밀번호를 설정해주면 된다.

실행은 
```
$ mysql -h localhost -u root -p
Enter password: 비밀번호
mysql>
```

#### 리눅스(우분투)
우분투에서는 GUI를 사용하지 않으므로 명령어를 순서대로 입력하여 설치한다
```
$ sudo apt-get update
$ sudo apt-get install -y mysql-server
$ sudo mysql_secure_installation
```

MySQL을 설치하는 과정에서 root 사용자의 비밀번호도 설정한다. 입력한 비밀번호를 기억해두어야 나중에 MySQL 서버에 접속할 수 있다.

혹시 비밀번호 설정 화면이 나오지 않고 설치가 완료된다면 비밀번호가 없는 상태가 된다. 이럴 경우에는 mysqladmin -u root -p password 비밀번호 명령어로 비밀번호를 설정할 수 있다. 명령어를 실행하고 나면 비밀번호를 묻는데 없는 경우에는 엔터를 치면 된다.

실행은 
```
$ mysql -h localhost -u root -p
Enter password : 비밀번호
mysql>
```
<hr>

### 워크벤치 설치하기
콘솔로는 데이터를 한눈에 보기에 무리가 있는데, 워크벤치라는 프로그램을 사용하면 데이터베이스 내부에 저장된 데이터를 시각적으로 관리할 수 있어 편리하다. 하지만 꼭 필요한 것은 아니다.

- 윈도우 : 인터넷에서 찾아서 설치
- 맥 : brew install --cask mysqlworkbench
- 리눅스 : gui를 사용하지 않으므로 설치할 필요 없다

### 커넥션 생성하기
윈도우나 맥에서 워크벤치를 설치했다면 실행해서 + 버튼 누르고 localhost랑 비번 아까 적은거 써서 설정 하고 실행하면 된다.

<hr>

### 데이터베이스 및 테이블 생성하기

#### 데이터베이스 생성하기
MySQL 프롬프트에 접속한다. CREATE SCHEMA [데이터베이스명]이 데이터베이스를 생성하는 명령어이다. SCHEMA라고 되어 있는데, MySQL에서 데이터베이스와 스키마는 같은 개념이다. nodejs라는 이름의 데이터베이스를 생성한다. 그 후 use nodejs; 명령어를 추가로 입력하여 앞으로 nodejs 데이터베이스를 사용하겠다는 것을 MySQL에 알린다.

```
mysql> CREATE SCHEMA `nodejs` DEFAULT CHARACTER SET utf8;
Query OK, 1 row affected (0.01sec)

mysql> use nodejs;
Database changed
```

### 테이블 생성하기
데이터베이스를 생성했다면 테이블을 만든다. 테이블이란 데이터가 들어갈 수 있는 틀을 의미하며, 테이블에 맞는 데이터만 들어갈 수 있다. 사용자의 정보를 저장하는 테이블을 만들어보겠다.

프롬프트에 작성 (자세한 내용은 적지 않도록 하겠다. 잘 알고 있는 내용이라..)

### CRUD 작업하기
Create, Read, Update, Delete의 첫 글자를 모은 두분자어이며 데이터베이스에서 많이 수행하는 네 가지 작업을 일컫는다. 그 방법만 익혀도 웬만한 프로그램은 다 만들 수 있을 정도로 CRUD 작업은 많이 사용된다.

#### Create (생성)
Create는 데이터를 생성해서 데이터베이스에 넣는 작업이다. use nodejs; 명령어를 사용했다면 테이블명으로 nodejs.users 대신 users 만 사용해도 된다.
```sql
INSERT INTO comment (commenter, comment) values (1, '안녕하세요, zero의  댓글입니다.');
```

#### Read (조회)
Read는 데이터베이스에 있는 데이터를 조회하는 작업이다.

```sql
SELECT * FROM nodejs.users;
```
and나 or 같은 내용은 생략하겠다

#### Update (수정)
Update는 데이터베이스에 있는 데이터를 수정하는 작업이다. 
```sql
UPDATE users SET comment = '바꿀 내용' WHERE id = 2;
```

#### Delete (삭제)
Delete는 데이터베이스에 있는 데이터를 삭제하는 작업이다.

```sql
DElETE FROM users WHERE id = 2;
```

### 시퀄라이즈 사용하기
(저자의 말)
MySQL 작업을 쉽게 할 수 있도록 도와주는 라이브러리가 있다. 바로 시퀄라이즈 이다.

시퀄라이즈는 ORM(Object-relational Mapping) 으로 분류된다. ORM은 자바스크립트 객체와 데이터베이스의 릴레이션을 매핑해주는 도구이다.

시퀄라이즈를 오로지 MySQL과 같이 써야만 하는 것은 아니다. 다른 데이터베이스도 같이 쓸 수 있다. 문법이 어느 정도 호환되므로 프로젝트를 다른 SQL 데이터베이스로 전환할 때도 편리하다.

시퀄라이즈를 쓰는 이유는 자바스크립트 구문을 알아서 SQL로 바꿔주기 때문이다. 따라서 SQL 언어를 직접 사용하지 않아도 자바스크립트만으로 조작할 수 있고, SQL을 몰라도 어느정도 다룰 수 있게 된다. 물론 모르는 채로 사용하는 것은 권장하지 않는다.

```console
$ npm i express morgan nunjucks sequelize sequelize-cli mysql2
$ npm i -D nodemon
```

sequelize-cli는 시퀄라이즈 명령어를 실행하기 위한 패키지이고, mysql2는 mysql과 시퀄라이즈를 이어주는 드라이버이다. mysql2 자체가 데이터베이스 프로그램은 아니므로 오해하면 안 된다.

설치 완료 후 sequelize init 명령어를 호출하면 된다. 전역 설치 없이 명령어로 사용하려면 앞에 npx를 붙이면 된다.

```
$ npx sequelize init
```

models/index.js
```js
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

module.exports = db;
```

Sequelize는 시퀄라이즈 패키지이자 생성자 이다. config/config.json에서 데이터베이스 설정을 불러온 후 new Sequelize 를 통해 MySQL 연결 객체를 생성한다. 연결 객체를 나중에 재사용 하기 위해 db.sequelize에 넣어두었다.

#### MySQL 연결하기
시퀄라이즈를 통해 익스프레스 앱과 MySQL을 연결해야 한다. app.js를 생성하고 연결 코드를 작성한다.

```js
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');

const {sequelize} = require('./models');

const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
});

sequelize.sync({force: false})
.then(() => {
    console.log('db 연결 성공')
})
.catch(err => {
    console.error(err);
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.join());
app.use(express.urlencoded({extended: false}));

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render(err);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
})
```

require('./models')는 index.js를 생략한 것, db.sequelize 를 불러와서 sync 메서드를 사용해 서버 실행 시 MySQL과 연동되도록 했다. 내부에 force:false 옵션이 있는데 이 옵션을 true로 설정해면 서버 실행 시마다 테이블을 재생성 한다. 테이블을 잘못 만든 경우에 true로 설정하면 된다.

MySQL과 연동할 때는 config 폴더 안의 config.json 정보가 사용한다. 다음과 같이 수정한다. 자동 생성한 config.json에 operator Aliases 속성이 들어 있다면 삭제한다.

development.password와 development.database를 현재 MySQL 커넥션과 일치하게 수정하면 된다. test와 production 쪽은 각각 테스트 용도와 배포 용도로 접속하기 위해 사용되는 것이므로 여기서는 설정하지 않는다. 

password 속성에는 mysql 비밀번호를 입력하고, database 속성에는 nodejs를 입력한다.

이 설정은 process.env.NODE_ENV가 development일 때 적용된다. 나중에 배포할 때는 process.env.NODE_ENV를 production으로 설정해둔다. 따라서 배포 환경을 위해 데이터베이스를 설정할 때는 config/config.json의 production 속성을 수정하면 된다. 마찬가지로 테스트 환경일 때는 test 속성을 수정한다.

npm start로 서버를 시작하면 3000번 포트에서 서버가 돌아간다. 라우터를 만들지 않았기에 실제로 접속할 수는 없지만 로그가 뜬다
```
Executing(default): SELECT 1+1 AS result
데이터베이스 연결 성공
```
이렇게 두 로그가 뜨면 연결이 성공한 것이다. 연결에 실패한 경우 에러 메시지가 로깅된다.
에러는 주로 MySQL 데이터베이스를 실행하지 않았거나, 비밀번호를 틀렸거나, 설정 파일을 못 불러왔을 때 발생한다.

#### 모델 정의하기
MySQL에서 정의한 테이블을 시퀄라이즈에서도 정의해야 한다. MySQL의 테이블은 시퀄라이즈의 모델과 대응된다. 시퀄라이즈는 모델과 MySQL의 테이블을 여결해주는 역할을 한다. User와 Comment 모델을 만들어 users 테이블과 comments 테이블에 연결해보겠다. 시퀄라이즈는 기본적으로 모델 이름은 단수형으로, 테이블 이름은 복수형으로 사용한다.

models/user.js
```js
const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      age: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      married: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
  }
};
```

User 모델을 만들고 모듈로 exports했다. User 모델은 Sequelize.Model 을 확장한 클래스로 선언한다. 클래스 문법을 사용하지만 클래스에 대한 지식이 없어도 사용할 수 있다. 패턴만 숙지하면 된다. 모델은 크게 static init 메서드와 static associate 메서드로 나뉜다.

init 메서드에는 테이블에 대한 설정을 하고, associate 메서드에는 다른 모델과의 관계를 적는다. init 메서드부터 살펴보면, super.init 메서드의 첫 번째 인수가 테이블 컬럼에 대한 설정이고, 두 번째 인수가 테이블 자체에 대한 설정이다.

시퀄라이즈는 알아서 id를 기본 키로 연결하므로 id 컬럼은 적어줄 필요가 없다. 나머지 컬럼의 스펙을 입력한다. MySQL 테이블과 컬럼 내용이 일치해야 정확하게 대응된다.

단, 시퀄라이즈 자료형은 MySQL의 자료형과는 조금 다르다. VARCHAR는 STRING, INT는 INTEGER, TYNYINT는 BOOLEAN으로, DATETIME은 DATE로 적는다. 

allowNull은 NOT NULL 옵션과 동일하다. unique 는 UNIQUE 옵션이다. defaultValue는 기본값을 의미하며, Sequelize.NOW로 현재 시간을 기본값으로 사용할 수 있다. SQL의 now()와 같다.

super.init 메서드의 두 번째 인수는 테이블 옵션이다.

- sequelize : static init 메서드의 매개변수와 연결되는 옵션으로 db.sequelize 객체를 넣어야 한다. 나중에 model/index.js 에서 연결한다.
- timestamps : 이 속성 값이 true면 시퀄라이즈는 createdAt과 updatedAt 컬럼을 추가한다. 각각 로우가 생서오딜 때와 수정될 때의 시간이 자동으로 입력된다. 하지만 예제에서는 직접 created_at 컬럼을 만들었으므로 timestamps 속성이 필요 하지 않다. 따라서 속성값을 false로 하여 자동으로 날짜 컬럼을 추가하는 기능을 해제했다.
- underscored : 시퀄라이즈는 기본적으로 테이블명과 컬럼명을 캐멀 케이스로 만든다. 이를 스네이크 케이스로 바꾸는 옵션이다.
- modelName : 모델 이름을 설정할 수 있다. 노드 프로젝트에서 사용한다.
- tableName : 실제 데이터베이스의 테이블 이름이 된다. 기본적으로 모델 이름을 소문자 및 복수형으로 만든다. 모델 이름이 User라면 테이블 이름은 users가 된다.
- paranoid : true 로 설정하면 deletedAt 이라는 컬럼이 생긴다. 로우를 삭제할 때 완전히 지워지지 않고 deletedAt 에 지운 시각이 기록된다. 로우를 조회하는 명령을 내렸을 때는 deletedAt의 값이 null인 로우를 조회한다. 이렇게 하는 이유는 나중에 로우를 복원하기 위해서이다. 로우를 복원해야 하는 상황이 생길 것 같다면 미리 true로 설정해두면 된다.
- charset 과 collate : 각각 utf8과 utf8_general_ci 로 설정해야 한글이 입력된다. 이모티콘까지 입력할 수 있게 하고 싶다면 utf8mb4와 utf8mb4_general_ci를 입력한다.

Comment 모델도 만들어보자
```js
const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      comment: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
    }, {
      sequelize,
      timestamps: false,
      modelName: 'Comment',
      tableName: 'comments',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Comment.belongsTo(db.User, { foreignKey: 'commenter', targetKey: 'id' });
  }
};
```

Comment 모델은 commenter 컬럼이 없다. 이 부분은 모델을 정의할 때 넣어도 되지만, 시퀄라이즈 자체에서 관계를 따로 정의할 수 있다. 

models/index.js
```js
const Sequelize = require('sequelize');
const User = require('./user');
const Comment = require('./comment');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Comment = Comment;

User.init(sequelize);
Comment.init(sequelize);

User.associate(db);
Comment.associate(db);

module.exports = db;
```

db라는 객체에 User와 Comment 모델을 담아두었다. db 객체를 require하여 User와 Comment 모델에 접근할 수 있다. User.init과 Comment.init은 각각의 모델의 static.init 메서드를 호출하는 것이다. init이 실행되어야 테이블이 모델로 연결된다. 다른 테이블과의 관계를 연결하는 associate 메서드도 미리 실행해둔다.

#### 관계 정의하기
(저자의 말)
사용자 한 명은 댓글을 여러 개 작성할 수 있다. 하지만 댓글 하나에 사용자가 여러 명일 수는 없다. 이러한 관계를 일대다 관계라고 한다. 1:N 관계에서는 사용자가 1이고, 댓글이 N이다.

다른 관계로 일대일, 다대다 관계가 있다. 일대일 관계로는 사용자와 사용자에 대한 정보 테이블을 예로 들 수 있다. 사용자 한 명은 자신의 정보를 담고 있는 테이블과만 관계가 있다. 정보 테이블도 한 사람만을 가리킨다. 이러한 관계를 일대일 관계라고 부른다. 

다대다 관계로는 게시글 테이블과 해시태그 테이블 관계를 예로 들 수 있다. 한 게시글에는 해시태그가 여러 개 달릴 수 있고, 한 해시태그도 여러 게시글에 달릴 수 있다. 이러한 관계를 다대다 관계라고 한다.

MySQL 에서는 JOIN이라는 기능으로 여러 테이블 간의 관계를 파악해 결과를 도출한다. 시퀄라이즈는 JOIN 기능도 알아서 구현한다. 대신 테이블 간에 어떠한 관계가 있는지 시퀄라이즈에 알려야 한다.

##### 1:N
시퀄라이즈에서는 1:N 관계를 hasMany 라는 메서드로 표현한다. users 테이블의 로우 하나를 불러올 때 연결된 comments 테이블의 로우들도 같이 불러올 수 있다. 반대로 belongsTo 메서드도 있다. comments 테이블의 로우를 불러올 때 연결된 users 테이블의 로우를 가져온다.

어떤 모델에 hasMany를 쓰고, 어떤 모델에 belongsTo를 쓰는지 헷갈릴텐데, 다른 모델의 정보가 들어가는 테이블에 belongsTo를 사용한다. 예제에서는 commenter 컬럼이 추가되는 Comment 모델에 belongsTo를 사용하면 된다. 사용자는 한 명이고, 그에 속한 댓글은 여러 개 이므로 댓글 로우에 사용자가 누구인지 적어야 한다.

시퀄라이즈는 위에서 정의한 대로 모델 간 관계를 파악해서 Comment 모델에 foreignKey 인 Commenter 컬럼을 추가한다. Commenter 모델의 외래 키 컬럼은 commenter고, User 모델의 id 컬럼을 가리키고 있다.

hasMany 메서드에서는 sourceKey 속성에 id를 넣고, belongsTo 메서드에서는 targetKey 속성에 id를 넣는다. sourceKey의 id와 targetKey의 id 모두 User 모델의 id 이다. hasMany에서는 sourceKey를 쓰고, belongsTo 에서는 targetKey를 쓴다고 생각하면 된다.

foreignKey를 따로 지정하지 않는다면 이름이 모델명 + 기본 키인 컬럼이 모델에 생성된다. 예를 들어 commenter를 foreignKey로 직접 넣어주지 않았다면 user+ 기본키 가 합쳐진 UserId가 foreignKey로 생성된다.

시퀄라이즈는 워크벤치가 테이블을 만들 때 실행했던 구문과 비슷한 SQL문을 만든다. create table 뒤에 if not exists라고 되어 있는데, 이 부분은 테이블이 존재하지 않을 경우에 실행된다는 뜻이다. 이미 워크벤치 또는 콘솔로 테이블을 만들어두었으므로 구문은 실행되지 않는다. 대신 실수로 테이블을 삭제했을 때는 위의 구문으로 인해 다시 테이블이 생성된다.

##### 1:1
1:1 관계에서는 hasMany 메서드 대신 hasOne 메서드를 사용한다. 사용자 정보를 담고 있는 가상의 Info 모델이 있다고 하면 
```js
db.User.hasOne(db.Info, {foreignKey: 'UserId', sourceKey : 'id'});
db.Info.belongsTo(db.User, {foreignKey: 'UserId', sourceKey : 'id'});
```
이렇게 표현할 수 있다. 
1:1 관계라고 해도 belongsTo 와 hasOne이 반대면 안된다. belongsTo를 사용하는 Info 모델에 UserId 컬럼이 추가되기 때문이다. 

##### N:M 
시퀄라이즈에는 N:M 관계를 표현하기 위한 belongsToMany 메서드가 있다. 게시글 정보를 담고 있는 가상의 Post 모델과 해시태그 정보를 담고 있는 가상의 Hashtag 모델이 있다고 하면 
```js
db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'});
db.Post.belongsToMany(db.Post, {through: 'PostHashtag'});
```
이렇게 표현할 수 있다.
양쪽 모델에 모두 belongsToMany 메서드를 사용한다. N:M 관계의 특성상 새로운 모델이 생성된다. through 속성에 그 이름을 적으면 된다. 새로 생성된 PostHashtag 모델에는 게시글과 해시태그의 아이디가 저장된다.

N:M에서는 데이터를 조회할 때 여러 단계를 거쳐야 한다. #노드 해시태그를 사용한 게시물을 조회하는 경우를 생각해보겠다. 먼저 #노드 해시태그를 Hashtag 모델에서 조회하고, 가져온 태그의 아이디를 바탕으로 PostHashtag 모델에서 hashtagId가 1인 postId들을 찾아 Post 모델에서 정보를 가져온다.

자동으로 만들어진 모델들도 다음과 같이 접근할 수 있다.
```js
db.sequelize.models.PostHashing
```

#### 쿼리 알아보기
시퀄라이즈로 CRUD 작업을 하려면 먼저 시퀄라이즈 쿼리를 알아야 한다. SQL문을 자바스크립트로 생성하는 것이라 시퀄라이즈 만의 방식이 있다. 쿼리는 프로미스를 반환하므로 then을 붙여 결괏값을 받을 수 있다. async/await 문법 과 같이 사용할 수도 있다. 

로우를 생성하는 쿼리부터 알아보겠다. 첫 줄이 SQL문이고, 그 아래는 시퀄라이즈 쿼리 이다.

```SQL
INSERT INTO nodejs.users (name, age, married, comment) VALUES ('zero', 24, 0, '자기소개1')
```
```js
const {User} = require('../models');
User.create({
  name:'zero',
  age : 24,
  married : false,
  comment : '자기소개1'
})
```

models 모듈에서 User 모델을 불러와 create 메서드를 사용하면 된다. 앞으로 나올 메서드들은 User 모델에서 불러왔다는 전제로 한다.

한 가지 주의할 점은 데이터를 넣을 때 MySQL의 자료형이 아니라 시퀄라이즈 모델에 정의한 자료형대로 넣어야 한다는 것이다. 이것이 married 가 0이 아니라 false인 이유이다. 시퀄라지으가 알아서 MySQL 자료형으로 바꾼다. 자료형이나 옵션에 부합하지 않는 데이터를 넣었을 때는 시퀄라이즈가 에러를 발생시킨다. 

users 테이블의 모든 데이터를 조회하는 SQL 문이다. findAll 메서드를 사용하면 된다.

```sql
SELECT * FROM nodejs.users;
User.findAll({})
```
다음은 Users 테이블의 데이터 하나만 가져오는 SQL 문이다. 앞으로 데이터를 하나만 가져올 때는 findOne 메서드를, 여러 개 가져올 때는 findAll 메서드를 사용한다고 보면 된다.

```sql
SELECT * FROM nodejs.users LIMIT 1;
User.findOne({})
```
attributes 옵션을 사용해서 원하는 컬럼만 가져올 수도 있다.
```sql 
SELECT name, married FROM nodejs.users;

User.findAll({
  attributes: ['name', 'married']
})
```

where 옵션이 조건들을 나열하는 옵션이다.

```sql
SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 30;
```
```js
const {Op} = require('sequelize');
const {User} = require('../models');
User.findAll({
  attributes: ['name', 'age'];
  where : {
    married : true,
    age : {[Op.gt]:30}
  }
});
```

MySQL에서는 undefined 라는 자료형을 지원하지 않으므로 where 옵션에는 undefined 가 들어가면 안된다. 빈 값을 넣고자 할 때는 null을 사용하면 된다.

age부분은 시퀄라이즈가 자바스크립트 객체를 사용해서 쿼리를 생성해야 하므로 Op.gt 같은 특수한 연산자들이 사용된다. Sequelize 객체 내부의 Op 객체를 불러와 사용한다.

자주 쓰이는 연산자로는 
- Op.gt(초과)
- Op.gte(이상)
- Op.lt(미만)
- Op.lte(이하)
- Op.ne(같지 않음)
- Op.or(또는)
- Op.in(배열 요소 중 하나)
- Op.notIn(배열 요소와 모두 다름)
등이 있다. or를 사용해보자면

```sql
SELECT id, name FROM users WHERE married = 0 OR age > 30;
```
```js
const {Op} = require('sequelize');
const {User} = require('../models');
User.findAll({
  attributes : ['id', 'name'],
  where : {
    [Op.or]: [{married : false}, {age : {[Op.gt]:30}}]
  }
});
```

or 속성에 OR 연산을 적용할 쿼리들을 배열로 나열하면 된다.

```sql
SELECT id, name FROM users ORDER BY age DESC;
```
```js
User.findAll({
  attributes: ['id', 'name'],
  order : [['age', 'DESC']]
})
```

시퀄라이즈의 정렬 방식이며, order 옵션으로 가능하다. 배열 안에 배열이 있다는 점에 주의해야 한다. 정렬은 꼭 하나로 하는 게 아니라 컬럼 두 개 이상으로 할 수도 있기 때문이다. 

다음은 조회할 로구 개수를 설정하는 방법이다. LIMIT 1 인 경우네느 findAll 대신 findOne 메서드를 사용해도 되지만, limit 옵션으로 할 수도 있다.
```sql
SELECT id, name FROM users ORDER BY age DESC LIMIT 1;
```
```js
User.findAll({
  attribute: ['id','name'],
  order : [['age', 'DESC']],
  limit: 1
})
```

OFFSET 역시 offset 속성으로 구현할 수 있다.
```sql
SELECT id, name FROM users ORDER BY age DESC LIMIT 1 OFFSET 1;
```
```js
User.findAll({
  attribute: ['id','name'],
  order : [['age', 'DESC']],
  limit: 1,
  offset: 1
})
```

로우를 수정하는 쿼리이다.
```sql
UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;
```
```js
User.update({
  comment: '바꿀 내용'
}, {
  where : {id: 2}
})
```
update 메서드로 수정할 수 있다. 첫 번쨰 인수는 수정할 내용이고, 두 번쨰 인수는 어떤 로우를 수정할지에 대한 조건이다. where 옵션에 조건들을 적는다.

로우를 삭제하는 쿼리이다.
```sql
DELETE FROM nodejs.users WHERE id =2;
```
```js
User.destroy({
  where : {id : 2}
})
```
destroy 메서드로 삭제한다. where 옵션을 적는 것은 똑같다.

##### 관계 쿼리
findOne이나 findAll 메서드를 호출할 때 프로미스의 결과로 모델을 반환한다.

```js
const user = await User.findOne({});
console.log(user.nick);
```

User 모델의 정보에도 바로 접근할 수 있지만 더 편리한 점은 관계 쿼리를 지원한다는 것이다. 
MYSQL로 따지면 JOIN 기능이다. 현재 User 모델은 Comment 모델과 hasMany-belongsTo 관계가 맺어져 있다. 만약 특정 사용자를 가져오면서 그 사람의 댓글까지 모두 가져오고 싶다면 include 속성을 사용한다.

```js
const user = await User.findOne({
  include : [{
    model: Comment
  }]
});
console.log(user.Comments);
```

어떤 모델과 관계가 있는지를 include 배열에 넣어주면 된다. 배열인 이유는 다양한 모델과 관계가 있을 수 있기 떄문이다. 댓글은 여러 개일 수 있으므로 user.Comments로 접근 가능하다. 또는 
```js
const user = await User.findOne({});
const comments = await user.getComments();
console.log(comments);
```

이렇게 접근할 수 있다.

관계를 설정했다면 getComments 외에도 setComments(), addComment(), addComments(), removeComments() 메서드를 지원한다. 동사 뒤에 모델의 이름이 붙는 형식이다.

동사 뒤의 모델 이름을 바꾸고 싶다면 관계 설정 시 as 옵션을 사용할 수 있다.
```js
db.User.hasMany(db.comment, {foreignKey:'commenter', sourceKey: 'id', as:'Answers'});

const user = await User.findOne({});
const comments = await user.getAnswers();
console.log(comments);
```

as를 설정하면 include 시 추가되는 댓글 객체도 user.Answers로 바뀐다.

include나 관계 쿼리 메서드에도 where 나 attributes 같은 옵션을 사용할 수 있다.

```js
const user = await User.findeOne({
  include: [{
    modle : Comment,
    where : {
      id: 1
    },
    attributes: ['id']
  }]
});

const comments = await user.getComments({
  where : {
    id: 1
  },
  attributes: ['id']
});
``` 

댓글을 가져올 때는 id 가 1인 댓글만 가져오고, 컬럼도 id 컬럼만 가져오도록 하고 있다. 
관계 쿼리 시 조회는 위와 같이 하지만 수정, 생성 삭제 때는 조금 다른 점이 있다.

```js
const user = await User.findOne({});
const comment = await Comment.create();
await user.addComment(comment);
await user.addComment(comment.id);
```

여러 개를 추가할 때는 배열로 추가할 수 있다.
```js
const user = await User.findOne({});
const comment1 = await Comment.create();
const comment2 = await Comment.create();
await user.addComment([comment1, comment2]);
```

관계 쿼리 메서드의 인수로 추가할 댓글 모델을 넣거나 댓글의 아이디를 넣으면 된다. 수정이나 삭제도 마찬가지이다.

##### SQL 쿼리하기
만약 시퀄라이즈의 쿼릴르 사용하기 싫거나 어떻게 할지 모르겠다면 직접 SQL 문을 통해 쿼리할 수 있다.
```js
const [result, metadata] = await sequelize.query('SELECT * FROM comments');
console.log(result);
```
웬만하면 시퀄라이즈의 쿼리를 사용하는 것을 추천하지만, 시퀄라이즈 쿼리로 할 수 없는 경우에는 위와 같이 하면 됩니다. - 저자의 말

#### 쿼리 수행하기
위에서 공부한 내용을 바탕으로 CRUD 작업을 해보겠다. 모델에서 데이터를 받아 페이지를 렌더링 하는 방법과 JSON 형식으로 데이터를 가져오는 방법을 알아보겠다.
(이 프로그램은 교재에 있는 것)
간단하게 사용자 정보를 등록하고, 사용자가 등록한 댓글을 가져오는 서버이다. 먼저 views 폴더를 만들고 그 안에 sequelize.html 과 error.html 파일을 만든다. ajax 를 사용해 서버와 통신할 것이다.

그리고 public 폴더 안에 sequelize.js 파일도 만든다.

라우터들을 미리 app.js에 연결한다.

먼저 GET /로 접속했을 때의 라우터이다. User.findAll 메서드로 모든 사용자를 찾은 후, squelzie.html 을 렌더링할 때 결괏값인 users를 넣는다.

시퀄라이즈는 프로미스를 기본적으로 지원하므로 async/await 과 try/catch 문을 사용해서 각각 조회 성공 시와 실패 시의 정보를 얻을 수 있다. 이렇게 미리 데이터베이스에서 데이터를 조회한 후 템플릿 렌더링에 사용할 수 있다. 

다음은 user.js로 router.route 메서드로같은 라우트 경로는 하나로 묶었다.

GET /users와 POST /users 주소로 요청이 들어올 때의 라우터이다. 각각 사용자를 조회하는 요청과 사용자를 등록하는 요청을 처리한다. GET / 에서도 사용자 데이터를 조회했지만, GET / users 에서는 데이터를 JSON 형식으로 반환한다는 것에 차이가 있다.

GET /users/:id/comments 라우터에는 findAll 메서드에 옵션이 추가되어 있다. include 옵션에서 model 속성에는 User 모델을, where 속성에는 :id로 받은 아이디 값을 넣었다. :id 는 라우트 매개변수로 6.3절에서 설명했다. req.params.id로 값을 가져올 수 있다. GET /users/1/comments 라면 사용자 id가 1인 댓글을 불러온다. 조회된 댓글 객체에는 include 로 넣어준 사용자 정보도 들어 있으므로 작성자의 이름이나 나이 등을 조회할 수 있다.

Comments.js
```js
const express = require('express');
const { Comment } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const comment = await Comment.create({
      commenter: req.body.id,
      comment: req.body.comment,
    });
    console.log(comment);
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.route('/:id')
  .patch(async (req, res, next) => {
    try {
      const result = await Comment.update({
        comment: req.body.comment,
      }, {
        where: { id: req.params.id },
      });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const result = await Comment.destroy({ where: { id: req.params.id } });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
```
댓글에 관련된 CRUD 작업을 하는 라우터이다. POST /comments, PATCH /comments/:id, DELETE/comments/:id 를 등록하였다.

POST /comments 라우터는 댓글을 생성하는 라우터이다. commenter 속성에 사용자 아이디를 넣어 사용자와 댓글을 연결한다.

PATCH /comments/:id와 DELETE /comments/:id 라우터는 각각 댓글을 수정, 삭제하는 라우터이다. 수정과 삭제는 각각 update와 destroy 메서드를 사용한다.

<hr>

실행하고 작동하는 것을 보았는데, 확실히 mysql 연결하고 만드는 것을 보니까 이전에 했었던 것보다 체계적이고 안정적으로 만들 수 있다는 것을 느꼈고, 맥에서 mysql을 사용하는데에 있어 애를 먹었지만 터미널에 익숙해지다보니 
앞으로 좀 더 능숙하게 할 수 있을것 같습니다.

<hr>

## 몽고디비
(저자의 말)
MySQL만 알고 있어도 많은 곳에서 사용할 수 있지만, 다른 유형의 데이터베이스인 몽고디비를 알아둔다면 더욱더 다양한 프로그램을 만들 수 있다.

몽고디비의 특징 중 하나는 자바스크립트 문법을 사용한다는 것이다. 노드도 자바스크립트를 사용하므로 데이터베이스마저 몽고디비를 사용한다면 자바스크립트만 사용하여 웹 애플리케이션을 만들 수 있는 것이다. 하나의 언어만 사용하면 되므로 생산성도 매우 높습니다. 하지만 몽고 디비는 흔히 사용하는 RDBMS가 아니라 뚜렷한 NoSQL 이므로 특징을 잘 알고 사용해야 한다.

### NoSQL vs SQL
MySQL은 SQL을 사용하는 대표적인 데이터베이스이다. 반면에 SQL을 사용하지 않는 NoSQL이라고 부르는 데이터베이스도 있다. 몽고디비는 NoSQL의 대표 주자이다.

SQL과 NoSQL은 여러 측면에서 다른데, 그 중에서 대표적인 몇 가지 차이점만 알아보겠다. 

SQL
- 규칙에 맞는 데이터 입력
- 테이블 간 JOIN 지원
- 안정성, 일관성
- 용어

NoSQL
- 자유로운 데이터 입력
- 컬렉션 간 JOIN 미지원
- 확장성, 가용성
- 용어

NoSQL에는 고정된 테이블이 없다. 테이블에 상응하는 컬렉션이라는 개념이 있긴 하지만, 컬럼을 따로 정의하지는 않는다. MySQL은 id, name 등등의 컬럼들의 조건과 자료형을 정의하지만, 몽고디비는 그냥 테이블 하나만 뚝 만들고 끝이다. 어떠한 데이터든 들어갈 수 있다.

몽고디비에는 MySQL과 달리 JOIN 기능이 없다. JOIN 을 흉내 낼 수는 있지만, 하나의 쿼리로 여러 테이블을 합치는 작업이 항상 가능하지는 않다. 동시에 쿼리를 수행하는 경우 쿼리가 섞여 예상치 못한 결과를 낼 가능성이 있다는 것도 단점이다.

이러한 단점에도 사용하는 이유는 확장성과 가용성 떄문이다. 데이터의 일관성을 보장해주는 기능이 약한 대신, 데이터를 빠르게 넣을 수 있고 쉽게 여러 서버에 데이터를 분산할 수 있다.

용어도 조금 다르다. MySQL의 테이블 로우 컬럼을 몽고디비에서는 각각 컬렉션 다큐먼트 필드라고 부른다.

애플리케이션을 만들 때 꼭 한 가지 데이터베이스만 사용해야 하는 것은 아니다. 많은 기업이 SQL과 NoSQL을 동시에 사용하고 있따. 서로 다른 특징을 가지고 있기에 상황에 알맞은 곳에 사용하면 된다.

### 몽고디비 설치하기
몽고디비는 공식사이트에서 다운받을 수 있다.
https://www.mongodb.com/download-center/community

#### 윈도우 
공식 사이트의 다운로드 화면에서 On-Premises를 선택하고, MongoDB Community Server 탭에서 Download 버튼을 눌러 파일을 내려받는다.

내려받은 파일을 실행하면 설치 화면이 나타난다. 동의할거 하고 뭐 하고 하면 설치가 끝

서버를 실행하기 전에 데이터가 저장될 폴더를 먼저 만든다. 윈도우의 경우 c 드라이브 아래 data 폴더를 만들고, 다시 그 안에 db 폴더를 만들면 된다.

몽고디비가 설치된 경로로 이동해서 몽고디비를 실행한다. 폴더가 없으면 실행되지 않으므로 반드시 폴더를 먼저 만들어야 한다. 콘솔에서 mongod 명령어를 입력하여 몽고디비를 실행한다. 방화벽 관련 팝업이 뜨면 허용 버튼을 눌러 접속을 허가한다.

에러 메시지가 없다면 성공이며 기본적으로 27017번 포트에서 실행된다. 

```
$ cd "설치된 경로"
$ mongod

waiting for connections on port 27017
```

몽고디비 프롬프트에 접속하려면 같은 폴더에서 콘솔을 하나 더 열어 mongo 명령어를 입력한다.

프롬프트가 > 로 바뀌었다면 성공이다. 이 상황에서 누구나 몽고디비에 접속할 수 있으므로 관리자 계정을 추가한다.

```cmd
> use admin
switched to db admin
> db.createUser({user:이름, pwd: 비밀번호, roles: ['root']})
```

db.createUser 메서드로 계정을 생성할 수 있다. user에 사용자 이름을 넣고, pwd 자리에 사용할 비밀번호를 입력한다. 이 비밀번호는 기억하고 있어야 한다. roles로는 현재 모든 권한이 있는 root를 부여했다. 

mongod를 입력했던 콘솔을 종료한 뒤 이번에는 mongod --auth 명령어로 접속한다. --auth는 로그인이 필요하다는 뜻이다.

```
mongod --auth
```

mongo admin -u 이름 -p  비밀번호 명령어로 접속한다.
```
mongo admin -u name -p pw
```

#### 맥
맥에서는 Homebrew 를 통해 몽고디비를 설치하는 것이 좋다.
```
brew tap mongodb/brew
brew install mongodb-community
```

실행은 
```
brew services start mongodb-community

mongo
```

관리자 계정 추가는 
```
use admin
db.createUser({ user: 'jai', pwd : '', roles: ['root']})

vi /usr/local/etc/mongod.conf 를 하고 
security: 
  authorization: enabled 
  이 두줄을 추가한다.

  그리고 다시 실행한다.
mongo admin -u 이름 -p 비밀번호 <- 이거로 관리자 접속
```

#### 리눅스(우분투)
우분투에서는 GUI를 사용하지 않으므로 콘솔에 다음 명령어들을 순서대로 입력하여 몽고디비를 설치한다. 명령어가 수시로 변경되므로 공식 사이트를 참고하는 것이 좋다.

이후 내용은 변경 사항이 있을 가능성이 있기도 하고 리눅스를 그리 자주 쓰는 편이 아니라 생략하도록 하겠다.

### 컴퍼스 설치하기
몽고디비는 관리 도구로 컴퍼스를 제공한다. 컴퍼스도 공식 사이트에서 내려받을 수 있다. 컴퍼스를 사용하면 GUI를 통해 데이터를 시각적으로 관리할 수 있어 편리하다. 하지만 꼭 필요하지는 않다.

- 약간 MySQL에서 워크벤치같은 느낌느낌

#### 윈도우
윈도우는 몽고디비 설치 시 함께 설치하기에 생략

#### 맥
```
brew cask install mongodb-compass-community // 이건 교재상이고 cask 사용법이 바뀌어서 다르게 설치
brew install --cask mongodb-compass-community 이렇게 하는건데.. 
```
터미널에서 못찾는다고 하여서 공식사이트에서 버전에 맞게 설치하자

#### 리눅스
리눅스는 위에 몽고디비 설치와 같은 이유로 생략하겠다.

#### 커넥션 생성하기
컴퍼스 실행 후 New Connection 화면에서 Fill in connection fields individually를 클릭한다.

Authentication을 Username / Password로 바꾸고, 몽고디비 계정 이름과 비밀번호를 입력한다.

그리고 connect! 하면 접속이 된다.

### 데이터베이스 및 컬렉션 생성하기

데이터베이스를 만드는 명령어는 use [데이터베이스명] 이다.

데이터베이스 목록을 확인하는 명령어는 show dbs이다.

위에서 만든 데이터베이스는 데이터를 최소 한 개 이상 넣어야 목록에 표시된다.

컬렉션은 따로 생성하지 않아도 된다. 다큐먼트를 넣는 순간 컬렉션도 자동으로 생성된다. 하지만 직접 생성하는 명령어가 있긴 하다. db.createCollection('users') 이다.

생성한 컬렉션 목록을 확인하는 명령어는 show collections 이다.

### CRUD 작업하기
#### Create (생성)
컬렉션에 컬럼을 정의하지 않아도 되므로 컬렉션에는 아무 데이터나 넣을 수 있다. 이러한 자유로움이 몽고디비의 장점이다. 단, 무엇이 들어올지 모른다는 단점도 있다.

몽고디비의 자료형은 MySQL과는 조금 다르다. 기본적으로 자바스크립트 문법을 사용하므로 자바스크립트의 자료형을 따른다. Date나 정규표현식 같은 자바스크립트 객체를 자료형으로 사용할 수 있고, Binary Data, ObjectId, Int, Long, Decimal, Timestamp, JavaScript 등의 추가적인 자료형이 있다. Undefined와 Symbol은 몽고디비에서 자료형으로 사용하지 않는다. 추가적인 자료형 중에서 ObjectId 와 Binary Data, Timestamp 외에는 잘 사용되지 않는다. ObjectId는 MySQL에서 기본키로 쓰이는 값과 비슷한 역할을 한다고 생각하면 된다. 고유한 값을 가지므로 다큐먼트를 조회할 때 사용할 수 있다.

db.컬렉션명.save(다큐먼트)로 다큐먼트를 생성할 수 있다. 자바스크립트 객체처럼 생성하면 된다. new Date()는 현재 시간을 입력하라는 뜻이다. 명령이 성공적으로 수행되었다면 WriteResult({ "nInserted":1})이라는 응답이 나온다. 다큐먼트 한 개가 생성되었다는 뜻이다. 실패했다면 에러 내용이 응답으로 온다.

```
db.users.find({name:'zero'},{_id: 1})
```
zero의 아이디가 ObjectId("머시깽이")라고 나왔다. 이 문자열은 사용자마다 다르다. 

#### Read(조회)
find({}) 는 컬렉션 내의 모든 다큐먼트를 조회하라는 뜻이다. 
특정 필드만 조회하고 싶다면 옵션을 정해주면 된다.
```
db.users.find({}, {_id:0, name: 1, marreid: 1});
```
find 메서드의 두 번째 인수로 조회할 필드를 넣었다. 1 또는 true로 표시한 필드만 가져온다. _id 는 기본적으로 가져오게 되어 있으므로 0 또는 false를 입력해 가져오지 않도록 해야 한다.

조회 시 조건을 주려면 첫 번째 인수 객체에 기입하면 된다.

$gt는 시퀄라이즈의 쿼리와 비슷하다. 몽고 디비는 자바스크립트 객체를 사용해서 명령어 쿼리를 생성해야 하므로 $gt 같은 특수한 연산자가 사용된다 

자주 쓰이는 연산자
- $gt(초과)
- $gte(이상)
- $lt(미만)
- $lte(이하)
- $ne(같지 않음)
- $or(또는)
- $in(배열 요소 중 하나)

몽고디비에서 OR 연산은 $or를 사용한다.

정렬도 가능하다. sort 메서드를 사용하면 된다. .sort({조건 : -1 or 1}) 이런식으로 사용하면 된다. 1은 오름차순이고 -1은 내림차순이다.

조회할 도큐먼투 개수를 설정할 수도 있다. limit 메서드를 사용하면 된다. .limit(조회할 개수) 이렇게 사용하면 된다.

다큐먼트 개수를 설정하면서 몇 개를 건너뛸지 설정할 수도 있다. skip 메서드를 사용하면 된다. .skip(건너뛸 개수) 이런식으로 사용한다. 

다른 쿼리도 많지만 이정도만 알면 예제는 풀 수 있다.

#### Update(수정)
교재에서 나온 데이터 수정문
```
db.users.update({name:'jai'}, {$set : {comment: '안녕하세요. 필드 바꾸기 입니다.'}})
```
첫 번째 객체는 수정할 다큐먼트를 지정하는 객체이고, 두 번쨰 객체는 수정할 내용을 입력하는 객체이다. $set이라는 연산자가 사용되었는데, 이 연산자는 어떤 필드를 수정할지 정하는 연산자이다. 만약 이 연산자를 사용하지 않고 일반 객체를 넣는다면 다큐먼트가 통쨰로 두 번쨰 인수로 주어진 객체로 수정되고 만다. 따라서 일부 필드만 수정하고 싶을 때는 반드시 $set 연산자를 지정해야 한다.

수정에 성공했다면 첫 번쨰  객체에 해당하는 도튜먼트 수와 수정된 다큐먼트 수가 나온다.

#### Delete(삭제)
교재에서 나온 데이터 삭제문
```
db.users.remove({name : 'jeon'})
```
삭제할 다큐먼트에 대한 정보가 담긴 객체를 첫번째 인수로 제공하면 된다. 성공 시 삭제된 개수가 반환된다.

### 몽구스 사용하기
MySQL에 시퀄라이즈가 있다면 몽고디비에는 몽구스가 있다.

몽구스는 시퀄라이즈와 달리 ODM이라고 불린다. 몽고디비는 릴레이션이 아니라 다큐먼트를 사용하므로 ORM이 아니라 ODM이다.

몽고디비 자체가 이미 자바스크립트인데도 굳이 자바스크립트 객체와 매핑하는 이유가 궁금할텐데 그 이유는 몽고디비에 없어서 불편한 기능들을 몽구스가 보완해주기 떄문이다.

먼저 스키마 라는 것이 생겼다. 몽고디비는 테이블이 없어서 자유롭게 데이터를 넣을 수 있지만, 때로는 자유로움이 불편함을 초대한다. 실수로 잘못된 자료형의 데이터를 넣을 수도 있고, 다른 다큐먼트에는 없는 필드의 데이터를 넣을 수도 있다. 몽구스는 몽고디비에 데이터를 넣기 전에 노드 서버 단에서 데이터를 한 번 필터링하는 역할을 한다.

또한, MySQL에 있는 JOIN 기능을 populate라는 메서드로 어느 정도 보완한다. 따라서 관계가 있는 데이터를 쉽게 가져올 수 있다. 비록 쿼리 한 번에 데이터를 합쳐서 가져오는 것은 아니지만, 이 작업을 우리가 직접 하지 않아도 되므로 편리하다.

ES2015 프로미스 문법과 강력하고 가독성이 높은 쿼리 빌더를 지원하는 것도 장점이다. 몽구스 실습을 위한 폴더를 만들겠다. 이름 : learn-mongoose

#### 몽고디비 연결하기
몽고디비는 주소를 사용해 연결한다. 주소 형식은 mongodb://[username:password@]host[:port][/[database][?options]]와 같다. [ ] 부분은 있어도 되고 없어도 됨을 의미한다.

username 과 password에 몽고디비 계정 이름과 비밀번호를 넣는다. host가 localhost, port 가 27017, 계정이 있는 database 가 admin 이므로 주소는 mongodb://이름:비밀번호@localhost:27017/admin 이 된다.

먼저 schemas 폴더를 루트 디렉터리에 생성한다. 폴더 안에 index.js 파일을 생성하고 
```js
const mongoose = require('mongoose');

const connect = () => {
    //----------- 1
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
    //-----------1
    //-----------2
    mongoose.connect('mongodb://jai:032508@localhost:27017/admin', {
        dbName: 'nodejs',
        useNewUrlParser: true,
        useCreateIndex: true
    }, (error) => {
        if (error) {
            console.log('몽고디비 연결 에러', error)
        } else {
            console.log('몽고디비 연결 성공')
        }
    });
};
//-----------2
//-----------3
mongoose.connection.on('error', (error) => {
    console.log('몽고디비 연결 에러', error);
});

mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도 합니다.');
    connect();
});
//-----------3
module.exports = connect;


```

1 : 개발 환경일 때만 콘솔을 통해 몽구스가 생성하는 쿼리 내용을 확인할 수 있게 하는 코드이다.

2 : 몽구스와 몽고디비를 연결하는 부분이다. 몽고디비 주소로 접속을 시도한다. 접속을 시도하는 주소의 데이터베이스는 admin이지만, 실제로 사용할 데이터베이스는 nodejs이므로 두 번째 인수로 dbName 옵션을 줘서 nodejs 데이터베이스를 사용하게 했다. 마지막 인수로 주어진 콜백 함수를 통해 연결 여부를 확인한다. 

- useNewUrlParser : true 와 useCreateIndex : true는 입력하지 않아도 되지만 콘솔에 경고 메시지가 뜨므로 넣었다.

3 : 몽구스 커넥션에 이벤트 리스너를 달아두었다. 에러 발생 시 에러 내용을 기록하고, 연결 종료 시 재연결을 시도한다.

app.js를 만들고 schemas/index.js와 연결한다.

app.js
```js
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');

const connect = require('./schemas');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comments');

const app = express();
app.set('port', process.env.PORT || 3002);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
connect();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
```
#### 스키마 정의하기
schemas 폴더에 user.js와 comment.js를 만든다.

user.js
```js
const mongoose = require('mongoose');

const {Schema} = mongoose;
const userSchema = new Schema({
name : {
    type: String,
    required: true,
    unique: true
},
age : {
    type : Number,
    required: true,
},
married : {
    type : Boolean,
    required: true
},
comment : String,
createdAt : {
    type: Date,
    default : Date.now
}
});

module.exports = mongoose.model('User', userSchema);
```

몽구스 모듈에서 Schema 생성자를 사용해 스키마를 만든다. 시퀄라이즈에서 모델을 정의한느 것과 비슷하다. 필드를 각각 정의한다.

몽구스는 알아서 _id를 기본 키로 생성하므로 _id 필드는 적어줄 필요가 없다. 나머지 필드의 스펙만 입력한다.

몽구스 스키마의 특이한 점은 String, Number, Date, Buffer, Boolean, Mixed, ObjectId, Array를 값으로 가질 수 있다는 점이다. 몽고디비의 자료형과 조금 다르며, 편의를 위해 종류 수를 줄여두었다.

위에 작성한 필드들을 각각에 맞게 설정한다. 

comment.js
```js
const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types : {ObjectId}} = Schema;

const commentSchema = new Schema({
    commenter : {
        type : ObjectId,
        required : true,
        ref : 'User'
    },
    comment : {
        type : String,
        required : true
    }, 
    createdAt : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);
```

commenter 속성만 보면 된다. 자료형이 ObjectId이다. 옵션으로 ref 속성의 값이 User로 주어져 잇다. commenter 필드에 User 스키마의 사용자 ObjectId 가 들어간다는 뜻이다. 나중에 몽구스가 JOIN 과 비슷한 기능을 할 때 사용한다.

#### 쿼리 수행하기

views 폴더 안에 mongoose.html과 error.html 파일을 만든다.

public 폴더 안에 mongoose.js 파일도 만든다.

mongoose.js
```js
// 사용자 이름 눌렀을 때 댓글 로딩
document.querySelectorAll('#user-list tr').forEach((el) => {
    el.addEventListener('click', function () {
      const id = el.querySelector('td').textContent;
      getComment(id);
    });
  });
  // 사용자 로딩
  async function getUser() {
    try {
      const res = await axios.get('/users');
      const users = res.data;
      console.log(users);
      const tbody = document.querySelector('#user-list tbody');
      tbody.innerHTML = '';
      users.map(function (user) {
        const row = document.createElement('tr');
        row.addEventListener('click', () => {
          getComment(user._id);
        });
        // 로우 셀 추가
        let td = document.createElement('td');
        td.textContent = user._id;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.name;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.age;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = user.married ? '기혼' : '미혼';
        row.appendChild(td);
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error(err);
    }
  }
  // 댓글 로딩
  async function getComment(id) {
    try {
      const res = await axios.get(`/users/${id}/comments`);
      const comments = res.data;
      const tbody = document.querySelector('#comment-list tbody');
      tbody.innerHTML = '';
      comments.map(function (comment) {
        // 로우 셀 추가
        const row = document.createElement('tr');
        let td = document.createElement('td');
        td.textContent = comment._id;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = comment.commenter.name;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = comment.comment;
        row.appendChild(td);
        const edit = document.createElement('button');
        edit.textContent = '수정';
        edit.addEventListener('click', async () => { // 수정 클릭 시
          const newComment = prompt('바꿀 내용을 입력하세요');
          if (!newComment) {
            return alert('내용을 반드시 입력하셔야 합니다');
          }
          try {
            await axios.patch(`/comments/${comment._id}`, { comment: newComment });
            getComment(id);
          } catch (err) {
            console.error(err);
          }
        });
        const remove = document.createElement('button');
        remove.textContent = '삭제';
        remove.addEventListener('click', async () => { // 삭제 클릭 시
          try {
            await axios.delete(`/comments/${comment._id}`);
            getComment(id);
          } catch (err) {
            console.error(err);
          }
        });
        // 버튼 추가
        td = document.createElement('td');
        td.appendChild(edit);
        row.appendChild(td);
        td = document.createElement('td');
        td.appendChild(remove);
        row.appendChild(td);
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error(err);
    }
  }
  // 사용자 등록 시
  document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    const age = e.target.age.value;
    const married = e.target.married.checked;
    if (!name) {
      return alert('이름을 입력하세요');
    }
    if (!age) {
      return alert('나이를 입력하세요');
    }
    try {
      await axios.post('/users', { name, age, married });
      getUser();
    } catch (err) {
      console.error(err);
    }
    e.target.username.value = '';
    e.target.age.value = '';
    e.target.married.checked = false;
  });
  // 댓글 등록 시
  document.getElementById('comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = e.target.userid.value;
    const comment = e.target.comment.value;
    if (!id) {
      return alert('아이디를 입력하세요');
    }
    if (!comment) {
      return alert('댓글을 입력하세요');
    }
    try {
      await axios.post('/comments', { id, comment });
      getComment(id);
    } catch (err) {
      console.error(err);
    }
    e.target.userid.value = '';
    e.target.comment.value = '';
  });
```


이제 라우터를 작성한다.

routes/index.js
```js
const express = require('express');
const User = require('../schemas/user');

const router = express.Router();
router.get('/', async(req, res, next) => {
    try {
        const users = await User.find({});
        res.render('mongoose', {users});
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
```
먼저 GET /로 접속했을 때의 라우터이다. User.find({}) 메서드로 모든 사용자를 찾은 뒤, mongoose.html 을 렌더링할 때 users 변수를 넣는다. find 메서드는 User 스키마를 require 한 뒤 사용할 수 있다. 몽고 디비의 db.users.find({}) 쿼리와 같다.

몽구스도 기본적으로 프로미스를 지원하므로 async/await 과 try/catch 문을 사용해서 각각 조회 성공 시와 실패 시의 정보를 얻을 수 있다. 이렇게 미리 데이터베이스에서 데이터를 조회한 후 템플릿 렌더링에 사용할 수 있다.

다음은 users.js이다.

routes/users.js
```js
const express = require('express');
const User = require('../schemas/user');
const Comment = require('../schemas/comment');

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const user = await User.create({
        name: req.body.name,
        age: req.body.age,
        married: req.body.married,
      });
      console.log(user);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.get('/:id/comments', async (req, res, next) => {
  try {
    const comments = await Comment.find({ commenter: req.params.id })
      .populate('commenter');
    console.log(comments);
    res.json(comments);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
```

GET /users와 POST /users 주소로 요청이 들어올 때의 라우터이다. 요청과 사용자를 등록하는 요청을 처리한다. GET / 에서도 사용자 데이터를 조회했지만 GET /users에서는 데이터를 JSON 형식으로 반환한다는 점에서 차이가 있다.

사용자를 등록할 때는 먼저 모델.create 메서드로 저장한다. 정의한 스키마에 부합하지 않는 데이터를 넣었을 때는 몽구스가 에러를 발생시킨다. _id는 자동으로 생성된다.

GET /users/:id/comments 라우터는 댓글 다큐먼트를 조회하는 라우터이다. find 메서드에는 옵션이 추가되어 있다. 먼저 댓글을 쓴 사용자의 아이디로 댓글을 조회한 뒤 populate 메서드로 관련 있는 컬렉션의 다큐먼트를 불러올 수 있다. Comment 스키마 commenter 필드의 ref가 User로 되어 있으므로 알아서 users 컬렉션에서 사용자 다큐먼트를 찾아 합친다. commenter 필드가 사용자 다큐먼트로 치환된다. 이제 commenter vlfemsms ObjectId가 아니라 그 ObjectId를 가진 사용자 다큐먼트가 된다.

routes/comments.js
```js
const express = require('express');
const Comment = require('../schemas/comment');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const comment = await Comment.create({
      commenter: req.body.id,
      comment: req.body.comment,
    });
    console.log(comment);
    const result = await Comment.populate(comment, { path: 'commenter' });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.route('/:id')
  .patch(async (req, res, next) => {
    try {
      const result = await Comment.update({
        _id: req.params.id,
      }, {
        comment: req.body.comment,
      });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const result = await Comment.remove({ _id: req.params.id });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
```

댓글에 관련된 CRUD 작업을 하는 라우터이다. POST /comments 라우터는 다큐먼트를 등록하는 라우터이다. Comment.create 메서드로 댓글을 저장한다. 그 후 populate 메서드로 프로미스의 결과로 반환된 comment 객체에 다른 컬렉션 다큐먼트를 불러온다. path 옵션으로 어떤 필드를 합칠지 설정하면 된다. 합쳐지 ㄴ결과를 클라이언트로 응답한다.

PATCH /comments/:id 라우터는 다큐먼트를 수정하는 라우터이다. 수정에는 update 메서드를 사용한다. update 메서드의 첫 번째 인수로는 어떤 다큐먼트를 수정할지를 나타낸 쿼리 객체를 제공하고, 두 번째 인수로는 수정할 필드와 값이 들어 있는 객체를 제공한다. 시퀄라이즈와는 인수의 순서가 반대이다. 몽고디비와 다르게 $set 연산자를 사용하지 않아도 기입한 필드만 바꾼다. 따라서 실수로 다큐먼트를 통째로 수정할 일이 없어 안전하다.

DELETE /comments/:id 라우터는 다큐먼트를 삭제하는 라우터이다. remove 메서드를 사용하여 삭제한다. remove 메서드에도 어떤 다큐먼트를 삭제할지에 대한 조건을 첫 번째 인수로 넣는다. 

서버를 실행하기 전에 먼저 몽고디비 서버를 실행하고 웹서버를 실행한다.

정상 작동 되는것을 확인하면 끝이다.

만약에 터진다면 최신 몽구스에서는 useCreateIndex를 기본 채용하고 있기에 적을 필요가 없어서 터지는 것으로 삭제 해주면 된다.

## 익스프레스로 SNS 서비스 만들기 
(저자의 말)
이제부터는 지금까지 배운 것을 바탕으로 실제 웹 서비스를 제장해보겠습니다. 앞에서 배운 내용은 다시 설명하지 않으니 실습하다가 잊어버린 내용이 있다면 언제든지 되돌아가 개념을 복습하길 바랍니다. 프로미스보다 async/await 문법을 적극적으로 사용하므로 어느정도 익숙해지고 나서 보는게 좋습니다.

이 장에서는 로그인, 이미지 업로드, 게시글 작성, 해시태그 검색, 팔로잉 등의 기능이 있는 SNS 서비스인 NodeBird 앱을 만들어봅니다. 노드, 익스프레스, 그리고 npm에 있는 오픈 소스와 함께라면 복잡할 것 같은 SNS 서비스도 금방 제작할 수 있습니다.

### 프로젝트 구조 갖추기
SNS 중에는 140자의 단문 메시지를 보내고 사람들이 메시지의 내용을 공유할 수 있는 서비스가 있다. 이와 유사한 서비스를 노드로 만들어보겠다. 프론트엔드 쪽 코드가 많이 들어가지만, 노드와 익스프레스 코드 위주로 보면 된다.

먼저 nodebird라는 폴더를 만든다. 항상 package.json을 제일 먼저 생성해야 한다. scripts 부분에 start 속성은 잊지말고 넣어야 한다.

nodebird 폴더 안에 package.json 을 생성했다면 이제 시퀄라이즈를 설치한다. 이 프로젝트 에서는 NoSQL대신 SQL을 데이터베이스로 사용할 것이다. sns 특성상 관계가 중요하므로 관계형 데이터베이스인 MySQL을 선택하였다.

먼저 프로젝트 db에 필요한 패키지들을 다운받는다.

console
```
npm i sequelize mysql2 sequelize-cli
npx sequelize init
```

시퀄라이즈를 init하면 models와 seeders 폴더가 생성된다. npx 명령어를 사용하는 이유는 전역 설치를 피하기 위해서 이다. 

이제 다른 폴더도 생성한다. 템플릿 파일을 넣을 views 폴더, 라우터를 넣을 routes 폴더, 정적 파일을 넣을 public 폴더가 필요하다. passport 패키지를 위한 passport 폴더도 만든다. 

마지막으로 익스프레스 서버 코드가 담길 app.js 와 설정값들을 담을 .env 파일을 nodebird 폴더 안에 생성한다. 폴더 구조는
- config 
- migrations
- models
- node_modules
- passport
- public
- routes 
- seeders
- views
- .env
- app.js
- package.json & lock.json

이고 이와 같은 구조라면 올바르게 설정된 것이다.

저자의 말, 이 구조는 고정된 구조가 아니므로 편의에 따라 바꿔도 된다. 서비스가 성장되고 규모가 커질수록 폴더 구도 복잡해지므로 각자 서비스에 맞는 구조를 적용해야 한다.

그리고 npm 패키지들을 설치하고 app.js를 작성한다. 템플릿 엔진은 넌적스를 사용할 것이다.

console
```
npm i express cookie-parser express-session morgan multer dotenv nunjucks
npm i -D nodemon
```

app.js
```js
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config();
const pageRouter= require('./routes/page');

const app = express();
app.set('port', process.env.PORT || 8000);
app.set('view-engine' , 'html');
nunjucks.configure('views', {
    express : app,
    watch : true
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET,
    cookie: {
        httpOnly : true,
        secure : false
    }
}));

app.use('/', pageRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
```

라우터로는 현재 pageRouter만 있지만, 추후에 더 추가할 예정이다. 라우터 이후에는 404 응답 미들웨어와 에러 처리 미들웨어가 있다. 마지막으로 앱을 8000번 포트에 연결했다.

.env
```
COOKIE_SECRET = cookiesecret
```

하드 코딩된 비밀번호가 유일하게 남아 있는 파일이 있다. 시퀄라이즈 설정을 담아둔 config.json이며, JSON 파일이라 process.env 를 사용할 수 없다. 

기본적인 라우터와 템플릿 엔진도 만들어야한다. routes 폴더 안에는 page.js를 views 폴더 안에는 layout, main, profile, join, error 파일들을 생성해야 한다. 약간의 디자인을 위해 main.css를 public 폴더 안데 생성한다.

routes/page.js
```js
const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = null;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdLIst = [];
    next();
});

router.get('/profile', (req, res) => {
    res.render('profile', {title : '내 정보 - NodeBird'});
});

router.get('/join', (req, res, next) => {
    const twits = [];
    res.render('main', {
        title : 'NodeBird',
        twits
    });
});

module.exports = router;
```

GET /profile, GET /join, GET / 까지 총 세 개의 페이지로 구성되어 있다. router.use로 라우터용 미들웨어를 만들어 템플릿 엔진에서 사용할 user, followingCount, followerCount, followerIdList 변수를 res.locals 로 설정하였다. 지금은 각각 null, 0, 0, [] 이지만 나중에 값을 넣을 것이다. res.locals로 값을 설정하는 이유는 변수들을 모든 템플릿 엔진에서 공통으로 사용하기 때문이다.

render 메서드 안의 twits도 지금은 빈 배열이지만 나중에 값을 넣는다.

그 다음은 클라이언트이다. 저자의 깃허브에서 코드를 복사해서 넣었다.

js 파일들은 길이가 너무 길어서 이 파일에는 적지 않고, 따로 작성하였다.

### 데이터베이스 세팅하기
로그인 기능이 있으므로 사용자 테이블이 필요하고, 게시글을 저장할 게시글 테이블도 필요하다. 해시태그를 사용하므로 해시태그 테이블도 만들어야 한다. 팔로잉 기능도 있는데, 이는 조금 뒤에 설명한다.

models 폴더 안에 user.js와 post.js, hashtag.js를 생성한다.

modles/user.js
```js
const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      nick: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      provider: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'local',
      },
      snsId: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.User, {
      foreignKey: 'followingId',
      as: 'Followers',
      through: 'Follow',
    });
    db.User.belongsToMany(db.User, {
      foreignKey: 'followerId',
      as: 'Followings',
      through: 'Follow',
    });
  }
};
```

사용자 정보를 저장하는 모델이다. 이메일, 닉네임, 비밀번호를 저장하고, SNS 로그인을 했을 경우 provider와 snsId를 저장한다. provider가 local이면 로컬 로그인을 한 것이고, kakao 면 카카오 로그인을 한 것이다. 기본적으로 로컬 로그인이라 가정해서 defaultValue를 local로 주었다.

테이블 옵션으로 timestamps 와 paranoid가 true로 주어졌으므로 createdAt, updatedAt, deletedAt 컬럼도 생성된다.

models/post.js
```js
const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
    static init(sequelize) {
        return init({
            content : {
                type : Sequelize.STRING(140),
                allowNull: false
            },
            img : {
                type : Sequelize.STRING(200),
                allowNull : false
            }
        }, {
            sequelize,
            timestamps : true,
            underscored : false,
            modelName : 'Post',
            tableName : 'posts',
            paranoid : false, 
            charset : 'utf8mb4', 
            collate : 'utf8mb4_general_ci'
        });
    }

    static associate(db) {}
};
```

게시글 모델은 게시글 내용과 이미지 경로를 저장한다. 게시글 등록자의 아이디를 담은 컬럼은 나중에 관계를 설정할 때 시퀄라이즈가 알아서 생성한다.

models/hashtag.js
```js
const Sequelize = require('sequelize');

module.exports = class Hashtag extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title : {
                type : Sequelize.STRING(15),
                allowNull : false,
                unique : true
            }
        }, {
            sequelize,
            timestamps : true,
            underscored : false,
            modelName : 'Hashtag',
            tableName : 'hashtags',
            paranoid : false,
            charset : 'utf8mb4',
            collate : 'utf8mb4_general_ci'
        });
    }

    static associate(db) {}
}
```

해시태그 모델은 태그 이름을 저장한다. 해시태그 모델을 따로 두는 것은 나중에 태그로 검색하기 위해서이다.

이제 생성한 모델들을 시퀄라이즈에 등록한다. models/index.js에는 시퀄라이즈가 자동으로 생성한 코드들이 들어 있을 것이다. 그 코드들을 아래 코드로 통째로 바꾼다.

models/index.js
```js
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);

module.exports = db;
```
각각의 모델들을 시퀄라이즈 객체에 연결하였다. 이번에는 각 모델 간의 관계를 associate 함수 안에 정의한다.

models/user.js
```js
...
static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.User, {
      foreignKey: 'followingId',
      as: 'Followers',
      through: 'Follow',
    });
    db.User.belongsToMany(db.User, {
      foreignKey: 'followerId',
      as: 'Followings',
      through: 'Follow',
    });
  }
...
```
User 모델과 Post 은 1:N 관계에 있으므로 hasMany 로 연결되어 있다. user.getPosts, user.addPosts 같은 관계 메서드들이 생성된다.

같은 모델끼리도 N:M 관계를 가질 수 있다. 팔로잉 기능이 대표적인 N:M 관계이다. 사용자 한 명이 팔로워 여러 명 가질 수도 있고, 한 사람이 여러 명을 팔로잉할 수도 있다. User 모델과 User 모델 간에 N:M 관계가 있는 것이다.

같은 테이블 간 N:M 관계에서는 모델 이름과 컬럼 이름을 따로 정해야 한다. 모델 이름이 UserUser일 수는 없으니까, through 옵션을 사용해 생성할 모델 이름을 Follow로 정했다. 

Follow 모델에서 사용자 아이디를 저장하는 컬럼 이름이 둘 다 UserId 면 누가 팔로워고 누가 팔로잉 중인지 구분되지 않으므로 따로 설정해야 한다. foreignKey 옵션에 각각 followerId, followingId를 넣어줘서 두 사용자 아이디를 구별했다.

같은 테이블 간의 N:M 관계에서는 as 옵션도 넣어야 한다. 둘 다 User 모델이라 구분되지 않기 때문이다. 주의할 점은 as는 foreignKey와 반대되는 모델을 가리킨다는 것이다. foreignKey면 as는 Follower여야 한다. 팔로워를 찾음려면 먼저 팔로잉 하는 사람의 아이디를 찾아야 하는 것이라고 생각하면 된다.

as에 특정한 이름을 지정했으니 user.getFollowers, user.getFollowings 같은 관계 메서드를 사용할 수 있다. include 시에도 as에 같은 값을 넣으면 관계 쿼리가 작동한다. 

post 모델도 작성한다.

models/post.js
```js
 static associate(db) {
      db.Post.belongsTo(db.User);
      db.Post.belongsToMany(db.Hashtag, {through : 'PostHashtag'})
  }
```

Hashtag 모델은 Post 모델과 N:M 관계이므로 관계를 설정하였다. 이에 대한 설명은 Post와 같다. 

NodeBird의 모델은 총 다섯 개, 즉 직접 생성한 User, Post, Hashtag 와 시퀄라이즈가 관계를 파악하여 생성한 PostHashtag, Follow 까지 이다.

자동으로 생성된 모델도 다음과 같이 접근할 수 있다. 
```js
db.sequelize.models.PostHashtag
db.sequelize.models.Follow
```

이제 생성한 모델을 데이터베이스 및 서버와 연결한다. 아직 데이터베이스를 만들지 않았으므로 데이터베이스부터 만들겠다. 데이터베이스의 이름은 nodebird이다.

위에 mysql을 공부할때는 프롬프트나 워크벤치를 통해 SQL으로 데이터베이스를 만들었는데, 시퀄라이즈는 config.json을 읽어 데이터베이스를 생성해주는 기능이 있다. 따라서 config.json을 먼저 수정한다. MySQL 비밀번호를 password 에 넣고 데이터베이스 이름을 nodebird로 바꾼다. 자동 생성한 config.json에 operatorAliases속성이 들어있다면 삭제한다.

콘솔에서 npx sequelize db:create 명령어를 입력하면 데이터베이스가 생성된다.

데이터베이스를 생성했으니 모델을 서버와 연결한다.

app.js
```js
const {sequelize} = require('./models');
...
sequelize.sync({force : false})
.then(() => 
    console.log('데이터베이스 연결 성공')
)
.catch((err) => {
    console.log(err);
});

```

서버 쪽 세팅이 완료되었다. 이제 서버를 실행한다. 시퀄라이즈는 테이블 생성 쿼리문에 IF NOT EXISTS를 넣어주므로 테이블이 없을 때 테이블을 자동으로 생성한다.

### Passport 모듈로 로그인 구현하기
SNS 서비스 이므로 로그인이 필요하다. 회원가입과 로그인을 직접 구현할 수도 있지만, 세션과 쿠키 처리 등 복잡한 작업이 많으므로 검증된 모듈을 사용하는 것이 좋다. 바로 Passport 를 사용하는 것이다. 이 모듈은 이름처럼 우리의 서비스를 사용할 수 있게 해주는 여권 같은 역할을 한다.

요즘에는 서비스에 로그인할 때 아이디와 비밀번호를 사용하지 않고 구글, 페이스북, 카카오톡 같은 기존의 SNS 서비스 계정으로 로그인하기도 한다. 이 또한 Passport를 사용해서 해결할 수 있다. 이 챕터에서 카카오 로그인도 사용한다.

console
```
npm i passport passport-local passport-kakao bcrypt
```

설치 후 모듈을 미리 app.js와 연결한다.
app.js
```js
const passport = require('passport');
...
const passportConfig = require('./passport');
...
passportConfig();
...
app.use(passport.initialize());
app.use(passport.session());

```

passport.initialize 미들웨어는 요청에 passport 설정을 심고, passport.session 미들웨어는 req.session 객체에 passport 정보를 저장한다. req.session 객체는 express-session 에서 생성하는 것이므로 passport 미들웨어는 express-session 미들웨어보다 뒤에 연결해야 한다.

passport/index.js
```js
const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({where: {id}})
        .then(user => done(null, user))
        .catch(err => done(err));
    });

    local();
    kakao();
}
```

모듈 내부를 보면 passport.serializeUser와 passport.deserializeUser가 있다. 이 부분이 Passport 를 이해하는 핵심이다.

serializeUser는 로그인 시 실행되며, req.session(세션) 객체에 어떤 데이터를 저장할지 정하는 메서드이다. 매개변수로 user를 받고 나서, done 함수에 두 번째 인수로 user.id를 넘기고 있다. 매개변수 user가 어디서 오는지는 나중에 설명하고, 지금은 일단 사용자 정보가 들어있다고 생각하면 된다.

done 함수의 첫 번째 인수는 에러 발생 시 사용하는 것이고, 두 번째 인수는 저장하고 싶은 데이터를 넣는다. 로그인 시 사용자 데이터를 세션에 저장하는데, 세션에 사용자 정보를 모두 저장하면 세션의 용량이 커지고 데이터 일관성에 문제가 발생하므로 사용자의 아이디만 저장하라고 명령한 것이다.

serializeUser가 로그인 시에만 실행된다면 deserializeUser는 매 요청 시 실행된다. passport.session 미들웨어가 이 메서드를 호출하고, serializeUser의 done의 두 번째 인수로 넣었던 데이터가 deserializeUser의 매개변수가 된다. 여기서는 사용자의 아이디이다. 조금 전에 serializeUser에서 세션에 저장했던 아이디를 받아 데이터베이스에서 사용자 정보를 조회한다. 조회한 정보를 req.user에 저장하므로 앞으로 req.user를 통해 로그인한 사용자의 정보를 가져올 수 있다.

즉, serializeUser는 사용자 정보 객체를 세션에 아이디로 저장하는 것이고, deserializeUser는 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것이다. 세션에 불필요한 데이터를 담아두지 않기 위한 과정이다.

전체 과정은 
1. 라우터를 통해 로그인 요청이 들어옴
2. 라우터에서 passport.authenticate 메서드 호출
3. 로그인 전략 수행
4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
5. req.login 메서드가 passport.serializeUser 호출
6. req.session에 사용자 아이디만 저장
7. 로그인 완료

로그인 이후 과정은
1. 요청이 들어옴
2. 라우터에 요청이 도달하기 전에 passport.session 미들웨어가 passport.deserializeUser 메서드 호출
3. req.session에 저장된 아이디로 데이터베이스에서 사용자 조회
4. 조회된 사용자 정보를 req.user에 저장
5. 라우터에서 req.user 객체 사용 사능

passport/index.js 의 localStrategy 와 kakaoStrategy 파일은 각각 로컬 로그인과 카카오 로그인 전략에 대한 파일이다. Passport는 로그인 시의 동작을 전략이라는 용어로 표현하고 있다. 다소 거창하긴 하지만, 로그인 과정을 어떻게 처리할 지 설명하는 파일이라고만 생각하면 된다.

#### 로컬 로그인 구현하기

로컬 로그인이란 다른 SNS 서비스를 통해 로그인하지 않고 자체적으로 회원가입 후 로그인하는 것을 의미한다. 즉, 아이디/비밀번호 또는 이메일/비밀번호를 통해 로그인하는 것이다.

Passport에서 이를 구현하려면 passport-local 모듈이 필요한데, 위에서 이미 설치 했기에 전략만 세우면 된다. 로그인에만 해당하는 전략이므로 회원가입은 따로 만들어야 한다. 

회원가입, 로그인, 로그아웃 라우터를 먼저 만든다. 이러한 라우터는 접근 조건이 있다. 로그인한 사용자는 회원가입과 로그인 라우터에 접근하면 안된다. 로그인하지 않은 사용자는 로그아웃 라우터에 접근하면 안된다. 따라서 라우터에 접근 권한을 제어하는 미들웨어가 필요하다. 미들웨어를 만들어보면서 Passport가 req 객체에 추가해주는 req.isAuthenticated 메서드를 사용해보겠다.

routes/middlewares.js
```js
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }else {
        res.status(403).send('로그인 필요');
    }
}

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    }else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`)
    }
}
```
Passport 는 req 객체에 isAuthenticated 메서드를 추가한다. 로그인 중이면 req.isAuthenticated() 가 true고, 그렇지 않으면 false이다. 따라서 로그인 여부를 이 메서드로 파악할 수 있다. 라우터들 중 로그아웃 라우터나 이미지 업로드 라우터 등은 로그인한 사람만 접근할 수 있게 해야 하고, 회원가입 라우터나 로그인 라우터는 로그인하지 않는 사람만 접근할 수 있게 해야 한다. 이럴 때 라우터에 로그인 여부를 검사하는 미들웨어를 넣어 걸러낼 수 있다. 

isLoggedInrhk isNotLoggedIn 미들웨어를 만들었다.

routes/page.js
```js
const {isLoggedIn, isNotLoggedIn} = require('./middleware');
...
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', {title : '내 정보 - NodeBird'});
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {title : '회원가입 - NodeBird'});
})
```
자신의 프로필은 로그인을 해야 볼 수 있으므로 isLoggedIn 미들웨어를 사용한다. req.isAuthenticated()가 true여야 next가 호출되어 res.render가 있는 미들웨어로 넘어갈 수있다. false라면 로그인 창이 있는 메인 페이지로 리다이렉트 된다.

회원가입 페이지는 로그인을 하지 않는 사람에게만 보여야 한다. 따라서 isNotLoggedIn 미들웨어로 req.isAuthenticated()가 false일 때만 nextfmf 호출하도록 하였다.

로그인 여부로만 미드루에어를 만들 수 있는 것이 아니라 팔로잉 여부, 관리자 여부 등의 미들웨어를 만들 수도 있으므로 다양하게 활용할 수 있다. res.locals.user 속성에 req.user를 넣은 것을 주목해보면, 넌적스에서 user객체를 통해 사용자 정보에 접근할 수 있게 되었다.

이제 회원가입, 로그인, 로그아웃 라우터를 작성한다.
routes/auth.js
```js
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();
// ----------------1
router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
// ----------------1
// ----------------2
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});
// ----------------2
// ----------------3
router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});
// ----------------3
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
```

나중에 app.js와 연결할 때 /auth 접두사를 붙일 것이므로 라우터의 주소는 각각 /auth/join, /auth/login, /auth/logout이 된다.

1. 회원가입 라우터이다. 기존에 같은 이메일로 가입한 사용자가 있는지 조회한 뒤, 있다면 회원가입 페이지로 되돌려보낸다. 단, 주소 뒤에 에러를 쿼리스트링으로 표시한다. 같은 이메일로 가입한 사용자가 없다면 비밀번호를 암호화하고, 사용자 정보를 생성한다. 회원가입 시 비밀번호는 암호화해서 저장해야 한다. 이번에는 bcrypt 모듈을 사용했다. bcrypt 모듈의 hash 메서드를 사용하면 쉽게 비밀번호를 암호화 할 수 있다. bcrypt의 두 번째 인수는 pbkdf2의 반복 횟수와 비슷한 기능을 한다. 숫자가 커질수록 비밀번호를 알아내기 어려워지지만 암호화 시간도 오래 걸린다. 
2. 로그인 라우터이다. 로그인 요청이 들어오면 passport.authenticate('local') 미들웨어가 로컬 로그인 전략을 수행한다. 미들웨어인데 라우터 미들웨어 안에 들어 있다. 미들웨어에 사용자 정의 기능을 추가하고 싶을때 이렇게 할 수 있다. 이럴 떄는 내부 미들웨어에 (req, res, next)를 인수로 제공해서 호출하면 된다. 전략 코드는 잠시 후에 작성한다. 전략이 성공하거나 실패하면 authenticate 메서드의 콜백함수가 실행된다. 콜백 함수의 첫 번째 매개변수 값이 있다면 실패한 것이다. 두 번째 매개변수 값이 있다면 성공한 것이고, req.login 메서드를 호출한다. Passport 는 req 객체에 login과 logout 메서드를 추가한다. req.login은 passport.serializeUser를 호출한다. req.login에 제공하는 user 객체가 serializeUser로 넘어가게 된다.
3. 로그아웃 라우터이다. req.logout 메서드는 req.user 객체를 제거하고, req.session.destroy는 req.session 객체의 내용을 제거한다 세션 정보를 지운 후 메인 페이지로 되돌아 간다. 로그인이 해제되어 있을 것이다.

passport/localStrategy.js
```js
const passport = require('passport');
const LocalStrategy = require('passports-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.use(new LocalStrategy ({
        usernameField : 'email',
        passwordField : 'password'
    }, async (email, password, done) => {
        try {
            const exUser = await User.findOne({ where : {email}});
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if(result) {
                    done(null, exUser);
                }else {
                    done(null, false, {message : '비밀번호가 일치하지 않는다.'});
                }
            } else {
                done(null, false, {message: '가입되지 않은 회원입니다.'});
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
}
```
로그인 전략을 구현했다. passport-local 모듈에서 Strategy 생성자를 불러와 그 안에 전략을 구현하면 된다.

1. LocalStrategy 생성자의 첫 번째 인수로 주어진 객체는 전략에 관한 설정을 하는 곳이다. usernameField와 passwordField 에는 일치하는 로그인 라우터의 req.body 속성명을 적으면 된다. req.body.email 에 이메일 주소가, req.body.password에 비밀번호가 담겨 들어오므로 email과 password를 각각 넣는다.
2. 실제 전략을 수행하는 async 함수이다. LocalStrategy 생성자의 두 번째 인수로 들어간다. 첫 번째 인수에서 넣어준 email과 password는 각각 async 함수의 첫 번째와 두 번째 매개변수가 된다. 세 번째 매개변수인 done 함수는 passport.authenticate 의 콜백 함수이다.

전략의 내용은 다음과 같다. 먼저 사용자 데이터베이스에서 일치하는 이메일이 있는지 찾은 후, 있다면 bcrypt 의 compare 함수로 비밀번호를 비교한다. 비밀번호까지 일치한다면 done 함수의 두 번쨰 인수로 사용자 정보를 넣어 보낸다. 두 번째 인수를 사용하지 않는 경우는 로그인에 실패했을 때뿐이다. done 함수의 첫 번째 인수를 사용하는 경우는 서버 쪽에서 에러가 발생했을 때고, 세 번째 인수를 사용하는 경우는 로그인 처리 과정에서 비밀번호가 일치하지 않거나 존재하지 않는 회원일 때와 같은 사용자 정의 에러가 발생했을 때이다.

done이 호출된 후에는 다시 passport.authenticate 의 콜백 함수에서 나머지 로직이 실행된다. 로그인에 성공했다면 메인페이지로 리다이렉트되면서 로그인 폼 대신 회원 정보가 뜰 것이다. 아직 auth 라우터를 연결하지 않았으므로 코드는 동작하지 않는다.

#### 카카오 로그인 구현하기
카카오 로그인이란 로그인 인증 과정을 카카오에 맡기는 것을 뜻한다. 사용자는 번거롭게 새로운 사이트에 회원가입하지 않아도 되므로 좋고, 서비스 제공자는 로그인 과정을 검증된 SNS에 안심하고 맡길 수 있어 좋다.

SNS 로그인의 특징은 회원가입 절차가 따로 없다는 것이다. 처음 로그인할 때는 회원가입 처리를 해야 하고, 두 번째 로그인부터는 로그인 처리를 해야 한다. 따라서 SNS 로그인 전략은 로컬 로그인 전략보다 다소 복잡하다.

passport/kakaoStrategy.js
```js
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');
//----------------1
module.exports = () => {
    passport.use(new KakaoStrategy({
        clientId : process.env.KAKAO_ID,
        callbackUrl : '/auth/kakao/callback'
        //----------------1
        //----------------2
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
            const exUser = await User.findOne({
                where : {snsId:profile.id, provider:'kakao'}
            });
            if(exUser) {
                done(null, exUser);
                //----------------2
                //----------------3
            }else {
                const newUser = await User.create({
                    email : profile._json && profile._json.kakao_account_email,
                    nick : profile.displayName,
                    snsId : profile.id,
                    provider : 'kakao'
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
    //----------------3
}
```

passport-kakao 모듈로부터 Strategy 생성자를 불러와 전략을 구현한다.

1. 로컬 로그인과 마찬가지로 카카오 로그인에 대한 설정을 한다. clientID 는 카카오에서 발급해주는 아이디이다. 노출되지 않아야 하므로 process.env.KAKAO_ID 로 설정했다. 나중에 아이디를 발급받아 .env 파일에 넣을 것이다. callbackURL 은 카카오로부터 인증 결과를 받을 라우터 주소이다. 아래에서 라우터를 작성할 때 이 주소를 사용한다.
2. 먼저 기존에 카카오를 통해 회원가입한 사용자가 있는지 조회한다. 있다면 이미 회원가입되어 있는 경우이므로 사용자 정보와 함께 done 함수를 호출하고 전략을 종료한다.
3. 카카오를 통해 회원가입한 사용자가 없다면 회원가입을 진행한다. 카카오에서는 인증 후 callbackURL 에 적힌 주소로 accessToken, refreshToken과 profile을 보낸다. profile에는 사용자 정보들이 들어 있다. 카카오에서 보내주는 것이므로 데이터는 console.log 메서드로 확인해보는 것이 좋다. profile 객체에서 원하는 정보를 꺼내와 회원가입을 하면 된다. 사용자를 생성한 뒤 done 함수를 호출한다.

이제 카카오 로그인 라우터를 만든다. 로그아웃 라우터 아래에 추가하면 된다. 회원가입을 따로 코딩할 필요가 없고, 카카오 로그인 전략이 대부분의 로직을 처리하므로 라우터가 상대적으로 간단하다.

routes/auth.js
```js
...
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});
...
```

GET /auth/kakao로 접근하면 카카오 로그인 과정이 시작된다. layout의 카카오톡 버튼에 링크가 붙어 있다. GET /auth/kakao에서 로그인 전략을 수행하는데, 처음에는 카카오 로그인 창으로 리다이렉트한다. 그 창에서 로그인 후 성공 여부 결과를 GET /auth/kakao/callback으로 받는다. 이 라우터에서는 카카오 로그인 전략을 다시 수행한다.

로컬 로그인과 다른 점은 passport.authenticate 메서드에 콜백 함수를 제공하지 않는다는 점이다. 카카오 로그인은 로그인 성공 시 내부적으로 req.login을 호출하므로 직접 호출할 필요가 없다. 콜백 함수 대신 로그인에 실패했을 때 어디로 이동할지를 failureRedirect 속성에 적고, 성공 시에도 어디로 이동할지를 다음 미들웨어에 적는다.

추가한 auth 라우터를 app.js에 연결한다.

app.js
```js
const authRouter = require('./routes/auth');
...
app.use('/auth', authRouter);
...
```

이렇게 하면 끝난것 같지만 아니다. kakaoStrategy.js에서 사용하는 clientID를 발급받아야 한다. 카카오 로그인을 위해서는 카카오 개발자 등록후 키를 받아야 한다.

애플리케이션 추가 후 발급받은 REST API 키를 복사해서 .env 파일에 추가한다.

.env
```
KAKAO_ID=발급 받은 키
```

사이트 도메인에는 http://localhost:8000을 입력한다. 만약 다른 포트를 사용하고 있다면 해당 포트를 적어야 한다.

활성화 상태를 on으로 바꾸고 리다이렉트 URI를 http://localhost:8000/auth/kakao/callback로 설정해준다.

제품 설정 > 카카오 로그인 > 동의항목 메뉴로 가서 원하는 정보가 있다면 설정 버튼을 누르고 저장

이제 실행을 하면 카카오 로그인이 된다.

### multer 패키지로 이미지 업로드 구현하기
SNS 서비스인 만큼 이미지 업로드도 중요하다. multer 모듈을 사용해 멀티파트 형식의 이미지를 업로드한다.

패키지를 먼저 설치한다. npm i multer

이미지를 어떻게 저장할 것인지는 서비스의 특성에 따라 달라진다. NodeBird 서비스는 input 태그를 통해 이미지를 선택할 때 바로 업로드를 진행하고, 업로드된 사진 주소를 다시 클라이언트에 알릴 것이다. 게시글을 저장할 때는 데이터베이스에 직접 이미지 데이터를 넣는 대신 이미지 경로만 저장한다. 이미지는 서버 디스크에 저장된다.

routes/post.js
```js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
```

POST /post/img 라우터와 POST /post 라우터를 만든다. app.use('/post')를 할 것이므로 앞에 /post 경로가 붙었다.

POST /post/img 라우터에서는 이미지 하나를 업로드 받은 뒤 이미지의 저장 경로를 클라이언트로 응답한다. static 미들웨어가 /img 경로의 정적 파일을 제공하므로 클라이언트에서 업로드 한 이미지에 접근할 수 있다.

POST /post 라우터는 게시글 업로드를 처리하는 라우터이다. 이전 라우터에서 이미지를 업로드 했다면 이미지 주소도 req.body.url로 전송된다. 비록 데이터 형식이 multipart이지만, 이미지 데이터가 들어 있지 않으므로 none 메서드를 사용했다. 이미지 주소가 온 것일 뿐, 이미지 데이터 자체가 오지는 않았다. 이미지는 이미 POST/img 라우터에서 저장되었다.

게시글을 데이터베이스에 저장한 후, 게시글 내용에서 해시태그를 정규표현식으로 추출해낸다. 추출한 해시태그는 데이터베이스에 저장하는데, 먼저 slice(1).toLowerCase()를 사용해 해시태그에서 #을 떼고 소문자로 바꾼다. 저장할 때는 findOrCreate 메서드를 사용했다. 이 시퀄라이즈 메서드는 데이터베이스에 해시태그가 존재하면 가져오고, 존재하지 않으면 생성한 후 가져온다. 결괏값으로 [모델, 생성 여부]를 반환하므로 result.map(r => r[0])으로 모델만 추출했다. 마지막으로 해시태그 모델들을 post.addHashtags 메서드로 게시글과 연결한다.

게시글 작성 기능이 추가되었으므로 이제부터 메인 페이지 로딩 시 메인 페이지와 게시글을 함께 로딩하도록 하겠다.

routes/page.js
```js
...
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes : ['id', 'nick']
      },
      order : [['createdAt', 'DESC']]
    });
    res.render('main', {
      title: 'NodeBird',
      twits: posts
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
  
});
...
```

main 부분을 위의 코드로 바꾼다.

먼저 데이터베이스에서 게시글을 조회한 뒤 결과를 twits에 넣어 렌더링한다. 조회할 때 게시글 작성자의 아이디와 닉네임을 JOIN해서 제공하고, 게시글의 순서는 최신순으로 정렬했다. 지금까지 이미지 업로드 기능을 만들었다. 남은 기능들을 마저 추가하고 서버를 실행해본다.

### 프로젝트 마무리하기
이미지 업로드까지 마무리되었으니 이제 팔로잉 기능과 해시태그 검색 기능만 추가하면된다.

다른 사용자를 팔로우하는 기능은 routes/user.js를 작성한다.

```js
const express = require('express');

const { isLoggedIn} = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where : {id : req.user.id}});
        if (user) {
            await user.addFollowing(parseInt(req.params.id, 10));
            res.send('success');
        }else {
            res.status(404).send('No user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
```

POST /user/:id/follow 라우터이다. :id 부분이 req.params.id가 된다. 먼저 팔로우할 사용자를 데이터베이스에서 조회한 후, 시퀄라이즈에서 추가한 addFollowing 메서드로 현재 로그인한 사용자의 관계를 지정한다.

팔로잉 관계가 생겼으므로 req.user에도 팔로워와 팔로잉 목록을 저장한다. 앞으로 사용자 정보를 불러올 때는 팔로워와 팔로잉 목록도 같이 불러오게 된다. req.user 를 바꾸려면 deserializeUser 를 조작해야 한다.

passport/index.js
```js
passport.deserializeUser((id, done) => {
    User.findOne({
         where: { id },
         include : [{
             model : User,
             attributes : ['id', 'nick'],
             as : 'Followers'
         }, {
             model : User,
             attributes : ['id', 'nick'],
             as : 'Followings'
         }]
        })
      .then(user => done(null, user))
      .catch(err => done(err));
  });
```

세션에 저장된 아이디로 사용자 정보를 조회할 때 팔로잉 목록과 팔로워 목록도 같이 조회한다. include에서 계속 attributes 를 지정하고 있는데, 이는 실수로 비밀번호를 조회하는 것을 방지하기 위해서이다.

팔로잉/팔로워 숫자와 팔로우 버튼을 표기하기 위해 routes/page.js를 수정한다.

routes/page.js
```js
router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
  next();
});
```

로그인한 경우에는 req.user가 존재하므로 팔로잉/팔로워 수와 팔로워 아이디 리스트를 넣는다. 팔로워 아이디 리스트를 넣는 이유는 팔로워 아이디 리스트에 게시글 작성자의 아이디가 존재하지 않으면 팔로우 버튼을 보여주기 위해서이다.

routes/page.js
```js
const { Post, User, Hashtag } = require('../models');

...
router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }

    return res.render('main', {
      title: `${query} | NodeBird`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
```

해시태그로 조회하는 GET /hashtag 라우터이다. 쿼리스트링으로 해시태그 이름을 받고 해시태그 값이 없는 경우 메인페이지로 돌려보낸다. 데이터베이스에서 해당 해시태그를 검색한 후, 해시태그가 있다면 시퀄라이즈에서 제공하는 getPosts 메서드로 모든 게시글을 가져온다. 가져올 때는 작성자 정보를 합친다. 조회 후 메인 페이지를 렌더링하면서 전체 게시글 대신 조회된 게시글만 twits에 넣어 렌더링한다.

마지막으로 routes/post.js 와 routes/user.js 를 app.js에 연결한다. 업로드한 이미지를 제공할 라우터도 express.static 미들웨어로 uploads 폴더와 연결한다. express.static 을 여러 번 쓸 수 있다는 사실을 기억해야 한다. 이제 uploads 폴더 내 사진들이 /img 주소로 제공된다.

app.js
```js
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
...
app.use('/post', postRouter);
app.use('/user', userRouter);
```

서버를 실행하고 정상 작동 되는지 확인하면 된다.

추가로 할만한 작업
- 팔로잉 끊기 (시퀄라이즈의 destroy 메서드와 라우터 활용)
- 프로필 정보 변경하기 (시퀄라이즈의 update 메서드와 라우터 활용)
- 게시글 좋아요 누르기 및 좋아요 취소하기 (사용자-게시글 모델 간 N:M 관계 정립 후 라우터 활용)
- 게시글 삭제하기 (등록자와 현재 로그인한 사용자가 같을 때, 시퀄라이즈의 destroy 메서드와 라우터 활용)
- 매번 데이터베이스를 조회하지 않도록 deserializeUser 캐싱하기 (객체 선언 후 객체에 사용자 정보 저장, 객체 안에 캐싱된 값이 있으면 조회)

## 웹 API 서버 만들기

저자의 말 - 이 챕터에서는 NodeBird 앱의 REST API 서버를 만들어보겠습니다. 노드는 자바스크립트 문법을 사용하므로 웹 API 서버에서 데이터를 전달할 때 사용하는 JSON을 100% 활용하기에 좋습니다.

API 서버는 프론트엔드와 분리되어 운영되므로 모바일 서버로도 사용할 수 있습니다. 노드를 모바일 서버로 사용하려면 이번 장과 같이 서버를 REST API 구조로 구성하면 됩니다. 특히 JWT 토큰은 모바일 앱과 노드 서버 간에 사용자 인증을 구현할 때 자주 사용됩니다.

사용자 인증, 사용량 제한 등의 기능을 구현하여 NodeBird의 웹 API 서버를 만들어봅시다. 이번 장을 위해 게시글을 다양하게 올려두세요.

### API 서버 이해하기
API는 Application Programming Interface의 두문자어로, 다른 애플리케이션에서 현재 프로그램의 기능을 사용할 수 있게 허용하는 접점을 의미한다.

웹 API는 다른 웹 서비스의 기능을 사용하거나 자원을 가져올 수 있는 창구이다. 흔히 API를 '열었다' 또는 '만들었다'고 표현하는데, 이는 다른 프로그램에서 현재 기능을 사용할 수 있게 허용했음을 뜻한다. 다른 사람에게 정보를 제공하고 싶은 부분만 API를 열어놓고, 제공하고 싶지 않은 부분은 API를 만들지 않는 것이다. 또한, API를 열어놓았다 하더라도 모든 사람이 정보를 가져갈 수 있는게 아니라 인증된 사람만 일정 횟수 내에서 가져가게 제한을 둘 수 있다.

위와 같은 서버에 API를 올려서 URL을 통해 접근할 수 있게 만든 것을 웹 API 서버라고 한다. 이 장에서 만들 서버도 NodeBird의 정보를 제공하는 웹 API이다. 단, 정보를 모든 사람이 아니라 인증된 사용자에게만 제공할 것이다.

여기서 크롤링이라는 개념을 알아두면 좋다. 크롤링을 해서 웹 사이트의 데이터를 수집했다는 말을 들어본 적이 있을 것이다. 크롤링은 웹 사이트가 자체적으로 제공하는 API 가 없거나 API 이용에 제한이 있을 때 사용하는 방법이다. 표면적으로 보이는 웹 사이트의 정보를 일정 주기로 수집해 자체적으로 가공하는 기술이다. 하지만 웹 사이트에서 제공하길 원치 않는 정보를 수집한다면 법적인 문제가 발생할 수도 있다. 

서비스 제공자 입장에서도 주기적으로 크롤링을 당하면 웹 서버의 트래픽이 증가하여 서버에 무리가 가므로, 웹 서비스를 만들 때 공개해도 되는 정보들은 API로 만들어 API를 통해 가져가게 하는 것이 좋다.

#### 프로젝트 구조 갖추기
(저자의 말)
이번 프로젝트는 NodeBird 서비스와 데이터베이스를 공유합니다. 다른 서비스가 NodeBird의 데이터나 서비스를 이용할 수 있도록 창구를 만드는 것이므로 프론트 쪽은 거의 다루지 않습니다.

우리는 다른 서비스에 NodeBird 서비스의 게시글, 해시태그, 사용자 정보를 JSON 형식으로 제공할 것입니다. 단, 인증을 받은 사용자에게만 일정한 할당량 안에서 API를 호출할 수 있도록 허용할 것입니다.

우선 nodebird-api 폴더를 만들고 package.json 파일을 생성한다. 새로 추가된 패키지는 uuid이며, 고유한 랜덤 문자열을 만들어내는 데 사용된다.

nodebird-api/app.js
```js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const morgan = require('passport');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config();
const authRouter = require('./route/auth');
const indexRouter = require('./routes');
const { sequelize } = require('./models');
const passport = require('./passport');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
});

sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch(err => {
        console.error(err);
    });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure : false
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/', indexRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
```
포트 번호를 8001로 했으므로 전에 만든 NodeBird 앱 서버 및 추후에 만들 클라이언트인 NodeDog 서버와 같이 실행할 수 있다. 콘솔을 하나 더 열어서 서버를 실행하면 된다.

도메인을 등록하는 기능이 새로 생겼으므로 도메인 모델도 추가한다. 도메인은 인터넷 주소를 뜻한다.

models/domain.js
```js
const Sequelize = require('sequelize');

module.exports = class Domain extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            host : {
                type: Sequelize.STRING(80),
                allowNull : false
            },
            type : {
                type: Sequelize.ENUM('free', 'premium'),
                allowNull : false
            },
            clientSecret : {
                type : Sequelize.UUID,
                allowNull: false
            }
        },{
            sequelize,
            timestamps: true,
            paranoid : true,
            modelName : 'Domain',
            tableName : 'domains'
        });
    }

    static associate(db) {
        db.Domain.belongsTo(db.user);
    }
}
```

도메인 모델에는 인터넷 주소와 도메인 종류, 클라이언트 비밀 키가 들어간다.

type 컬럼을 보면 처음 보는 ENUM 이라는 속성을 갖고 있다. 넣을 수 있는 값을 제한하는 데이터 형식이다. 무료나 프리미엄 중에서 하나의 종류만 선택할 수 있게 했고, 이를 어겼을 때 에러가 발생한다.

클라이언트 비밀 키는 다른 개발자들이 NodeBird의 API를 사용할 때 필요한 비밀 키이다. 이 키가 유출되면 다른 사람으로 사칭해서 요청을 보낼 수 있으므로, 유출되지 않도록 주의해야 한다. 한 가지 안전 장치로서, 요청을 보낸 도메인까지 일치해야 요청을 보낼 수 있게 제한을 둘 것이다. clientSecret 컬럼은 UUID라는 타입을 가진다. UUID는 충돌 가능성이 매우 적은 랜덤한 문자열이다.

이제 새로 생성한 도메인 모델을 시퀄라이즈와 연결한다. 사용자 모델과 일대다 관계를 가지는데, 사용자 한 명이 여러 도메인을 소유할 수도 있기 때문이다.

models/index.js
```js
const Domain = require('./domain');

db.Domain = Domain;
Domain.init(sequelize);
Domain.associate(db);
```

nodebird-api/models/user.js
```js
db.User.hasMany(db.Domain);
```

다음은 로그인하는 화면이다. 카카오 로그인은 제외했다. 카카오 로그인을 추가하려면 카카오 개발자 사이트에서 도메인을 추가로 등록해야 한다.


nodebird-api/views/login.html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>API 서버 로그인</title>
    <style>
      .input-group label { width: 200px; display: inline-block; }
    </style>
  </head>
  <body>
    {% if user and user.id %}
      <span class="user-name">안녕하세요! {{user.nick}}님</span>
      <a href="/auth/logout">
        <button>로그아웃</button>
      </a>
      <fieldset>
        <legend>도메인 등록</legend>
        <form action="/domain" method="post">
          <div>
            <label for="type-free">무료</label>
            <input type="radio" id="type-free" name="type" value="free">
            <label for="type-premium">프리미엄</label>
            <input type="radio" id="type-premium" name="type" value="premium">
          </div>
          <div>
            <label for="host">도메인</label>
            <input type="text" id="host" name="host" placeholder="ex) zerocho.com">
          </div>
          <button>저장</button>
        </form>
      </fieldset>
      <table>
        <tr>
          <th>도메인 주소</th>
          <th>타입</th>
          <th>클라이언트 비밀키</th>
        </tr>
        {% for domain in domains %}
          <tr>
            <td>{{domain.host}}</td>
            <td>{{domain.type}}</td>
            <td>{{domain.clientSecret}}</td>
          </tr>
        {% endfor %}
      </table>
    {% else %}
      <form action="/auth/login" id="login-form" method="post">
        <h2>NodeBird 계정으로 로그인하세요.</h2>
        <div class="input-group">
          <label for="email">이메일</label>
          <input id="email" type="email" name="email" required autofocus>
        </div>
        <div class="input-group">
          <label for="password">비밀번호</label>
          <input id="password" type="password" name="password" required>
        </div>
        <div>회원가입은 localhost:8001에서 하세요.</div>
        <button id="login" type="submit">로그인</button>
      </form>
      <script>
        window.onload = () => {
          if (new URL(location.href).searchParams.get('loginError')) {
            alert(new URL(location.href).searchParams.get('loginError'));
          }
        };
      </script>
    {% endif %}
  </body>
</html>
```

위 코드에는 도메인을 등록하는 화면도 포함되어 있다. 로그인하지 않았다면 로그인 창이 먼저 뜨고, 로그인한 사용자에게는 도메인 등록 화면을 보여준다.

nodebird-api/routes/index.js
```js
const express = require('express');
const { v4: uuidv4} = require('uuid');
const {User, Domain} = require('.../models');
const { idLoggedIn, isLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async(req, res, next) => {
    try {
        const user = await User.findOne({
            where : {id : req.user && req.user.id || null},
            include : {model: Domain}
        });
        res.render('login', {
            user,
            domains : user && user.Domains
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/domain', isLoggedIn, async (req, res, next) => {
    try {
        await Domain.create({
            UserId : req.user.id,
            host : req.body.host,
            type : req.body.type,
            clientSecret : uuidv4()
        })
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
```

GET / 라우터와 도메인 등록 라우터이다.

GET /는 접속 시 로그인 화면을 보여주며, 도메인 등록 라우터는 폼으로부터 온 데이터를 도메인 모델에 저장한다.

도메인 등록 라우터에서는 clientSecret 의 값을 uuid 패키지를 통해 생성한다. uuid 중에서도 4 버전을 사용하였다. 36자리 문자열 형식으로 생겼으며 세 번째 마디의 첫 번째 숫자가 버전을 알려준다. const { v4 : uuidv4} 부분이 특이한데, 패키지의 변수나 함수를 불러올 때 이름을 바꿀 수 있다. v4에서 uuidv4로 바꾸었다.

이제 서버를 실행하고 접속한다. 지금부터 api 서비스를 이용하는 사용자 입장에서 허가를 받아야 한다.

사용자 정보는 NodeBird 앱과 공유하므로 NodeBird 앱의 아이디로 로그인하면 된다. 카카오 로그인은 제외했으니 로컬로 가입한 이메일을 통해 로그인한다. 로그인 후에는 도메인 등록 화면이 뜬다.

도메인을 등록하는 이유는 등록한 도메인에서만 API를 사용할 수 있게 하기 위해서이다. 웹 브라우저에서 요청을 보낼 때, 응답을 하는 곳과 도메인이 다르면 CORS 에러가 발생할 수 있다. 브라우저가 현재 웹 사이트에서 함부로 다른 서버에 접근하는 것을 막는 조치이다. CORS 문제를 해결하려면 API 서버 쪽에서 미리 허용할 도메인을 등록해야 한다. 서버에서 서버로 요청을 보내는 경우에는 CORS 문제가 발생하지 않는다. CORS는 브라우저에서 발생하는 에러이기 때문이다. 

무료와 프리미엄은 나중에 사용량 제한을 구현하기 위한 구분값이다. 프리미엄 도메인에는 더 많은 사용량을 허가할 것이다.

이제 localhost:4000 도메인을 등록한다. NodeBird API를 사용할 도메인 주소이며, 다른 개발자들이 만든 서버라고 생각하면 된다. 클라이언트 비밀 키는 랜덤한 문자열이므로 이 책과 다를 수 있다.

발급받은 비밀 키는 localhost:4000 서비스에서 NodeBird API를 호출할 때 인증 용도로 사용한다. 비밀 키가 유출되면 다른 사람이 마치 등록한 유저가 호출한 것처럼 API를 사용할 수 있으므로 조심해야 한다.

```
96cecc78-0002-4393-952e-f2b1b519a642
```

### JWT 토큰으로 인증하기

NodeBird 앱이 아닌 다른 클라이언트가 NodeBird의 데이터를 가져갈 수 있게 해야 하는 만큼 별도의 인증 과정이 필요하다. 

JWT 는 JSON Web Token의 약어로, JSON 형식의 데이터를 저장하는 토큰이다. JWT는 다음과 같이 세 부분으로 구성되어 있다.

- 헤더 : 토큰 종류와 해시 알고리즘 정보가 들어 있다.
- 페이로드 : 토큰의 내용물이 인코딩된 부분이다.
- 시그니처 : 일련의 문자열이며, 시그니처를 통해 토큰이 변도되었는지 여부를 확인할 수 있다.

시크니처는 JWT 비밀 키로 만들어진다. 이 비밀 키가 노출되면 JWT 토큰을 위조할 수 있으므로 비밀 키를 철저히 숨겨야 한다. 시그니처 자체는 숨기지 않아도 된다. 

JWT에는 민감한 내용을 넣으면 안된다. 내용을 볼 수 있기 때문이다.

내용이 노출되는 토큰을 왜 사용할까? 모순적이지만, 내용이 들어있기 때문이다. 만약 내용이 없는 랜덤한 토큰이라고 생각해보자면 랜덤한 토큰을 받으면 토큰의 주인이 누구인지, 그 사람의 권한은 무엇인지를 매 요청마다 체크해야 한다. 이러한 작업은 보통 데이터베이스를 조회해야 하는 복잡한 작업인 경우가 많다.

JWT 토큰은 JWT 비밀 키를 알지 않는 이상 변조가 불가능하다. 변조한 토큰은 시그니처를 비밀 키를 통해 검사할 때 들통난다. 변조할 수 없으므로 내용물이 바뀌지 않았는지 걱정할 필요가 없다. 다시 말하면 내용물을 믿고 사용할 수 있다. 즉, 사용자 이름, 권한 같은 것을 안심하고 사용해도 된다는 것이다. 단, 외부에 노출되어도 좋은 정보에 한해서이다. 비밀번호를 제외하고 사용자의 이메일이나 사용자의 권한 같은 것들을 넣어두면 데이터베이스 조회 없이도 그 사용자를 믿고 권한을 줄 수 있다.

JWT 토큰의 단점은 용량이 크다는 것이다. 내용물이 들어 있으므로 랜덤한 토큰을 사용할 때와 비교해서 용량이 클 수밖에 없다. 매 요청 시 토큰이 오고 가서 데이터 양이 증가한다. 이렇게 장단점이 뚜렷하므로 적절한 경우에 사용하면 좋다. 비용을 생각해보면 판단하기 쉽다. 랜덤 스트링을 사용해서 매번 조회하는데 사용하는 작업량이 싼지, 내용물이 들어있는 토큰 자체의 데이터 비용이 싼지 비교하면 된다.

먼저 JWT 모듈을 설치한다.

console
```
npm i jsonwebtoken
```
.env
```
JWT_SECRET = jwtScret
```

nodebird-app/routes/middlewares.js
```js
exports.verifyToken = (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if(error.name === 'TokenExpiredError') {
      return res.status(419).json({
        code : 419,
        message : '토큰이 만료되었습니다.'
      });
    }
    return res.status(401).json({
      code: 401,
      message : '유효하지 않은 토큰입니다.'
    });
  }
}
```

요청 헤더에 저장된 토큰을 사용한다. 사용자가 쿠키처럼 헤더에 토큰을 넣어 보낼 것이다. jwt.verify 메서드로 토큰을 검증할 수 있다. 메서드의 첫 번째 인수로는 토큰을, 두 번째 인수로는 토큰의 비밀 키를 넣는다.

토큰의 비밀 키가 일치하지 않는다면 인증을 받을 수 없다. 그런 경우에는 에러가 발생하여 catch문으로 이동하게 된다. 또한, 올바른 토큰이더라도 유효 기간이 지난 경우라면 역시 catch 문으로 이동한다. 유효 기간 만료 시 419 상태 코드를 응답하는데, 코드는 400번 대 숫자 중에서 마음대로 정해도 된다.

인증에 성공한 경우에는 토큰의 내용이 반환되어 req.decoded 에 저장된다. 토큰의 내용은 조금 전에 넣은 사용자 아이디와 닉네임, 발급자, 유효 기간 등이다. req.decoded를 통해 다음 미들웨어에서 토큰의 내용물을 사용할 수 있다.

/routes/v1.js
```js
const express = require('express');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./middlewares');
const { Domain, User } = require('../models'); 

const router = express.Router();

router.post('/token', async (req, res) => {
    const { clientSecret } = req.body;

    try {
        const domain = await Domain.findOne({
            where : { clientSecret },
            include : {
                model : User, 
                attribute: ['nick', 'id']
            }
        });
        if(!domain) {
            return res.status(401).json({
                code: 401,
                message : '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요'
            });
        }
        const token = jwt.sign({
            id : domain.User.id,
            nick : domain.User.nick
        }, process.env.JWT_SECRET, {
            expiresIn: '1m',
            issuer:  'nodebird'
        });
        return res.json({
            code: 200,
            message: '토큰이 발급되었습니다.',
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code:500,
            message: '서버 에러'
        });
    }
});

router.get('/test', verifyToken, (req, res) => {
    res.json(req.decoded);
});

module.exports = router;
```

토큰을 발급하는 라우터와 사용자가 토큰을 테스트해볼 수 있는 라우터를 만들었다.

라우터의 이름은 v1으로, 버전 1이라는 뜻이다. 버전은 1.0.0 처럼 SemVer식으로 정해도 된다. 라우터에 버전을 붙인 이유는, 한 번 버전이 정해진 후에는 라우터를 함부로 수정하면 안 되기 때문이다. 다른 사람이나 서비스가 기존 API를 쓰고 있음을 항상 염두에 두어야 한다. API 서버의 코드를 바꾸면 API를 사용 중인 다른 사람에게 영향을 미친다. 특히 기존에 있던 라우터가 수정되는 순간 API를 사용하는 프로그램들이 오작동할 수 있다. 따라서 기존 사용자에게 영향을 미칠 정도로 수정해야 한다면, 버전을 올린 라우터를 새로 추가하고 이전 API를 쓰는 사람들에게는 새로운 API가 나왔음을 알리는 것이 좋다. 이전 APi를 없앨 때도 어느 정도 기간을 두고 미리 공지하여 사람들이 다음 API로 충분히 넘어갔을 때 없애는 것이 좋다.

v1/token 라우터에서는 전달받은 클라이언트 비밀 키로 도메인이 등록된 것인지를 먼저 확인한다. 등록되지 않은 도메인이라면 에러 메시지로 응답하고, 등록된 도메인이라면 토큰을 발급해서 응답한다. 토큰은 jwt.sign 메서드로 발급받을 수 있다.

```js
 const token = jwt.sign({
    id : domain.User.id,
    nick : domain.User.nick
}, process.env.JWT_SECRET, {
    expiresIn: '1m',
    issuer:  'nodebird'
});
```

위 코드에서 sign 메서드의 첫 번째 인수는 토큰의 내용이다. 사용자의 아이디와 닉네임을 넣었다. 두 번째 인수는 토큰의 비밀 키이다. 이 비밀 키가 유출되면 다른 사람이 NodeBird 서비스의 토큰을 임의로 만들어낼 수 있으므로 조심해야 한다. 세 번째 인수는 토큰의 설정이다. 유효 기간을 1분으로, 발급자를 nodebird로 적었다. 1m으로 표기된 부분은  60*1000 처럼 밀리초 단위로 적어도 된다. 발급되고 나서 1분이 지나면 토큰이 만료되므로, 만료되었다면 토큰을 재발급받아야 한다. 유효 기간은 서비스 정책에 따라 알아서 정하면 된다.

v1/test 라우터는 사용자가 발급받은 토큰을 테스트해볼 수 있는 라우터이다. 토큰을 검증하는 미들웨어를 거친 후, 검증이 성공했다면 토큰의 내용물을 응답으로 보낸다.

라우터의 응답을 살펴보면 모두 일정한 형식을 갖추고 있다. JSON 형태에 code, message 속성이 존재하고, 토큰이 있는 경우 token 속성도 존재한다. 이렇게 일정한 형식을 갖춰야 응답받는 쪽에서 처리하기 좋다. code는 HTTP 상태 코드를 사용해도 되고, 임의로 숫자를 부여해도 된다. 일관성만 있다면 문제 없다. 사용자들이 code만 봐도 어떤 문제인지 알 수 있게 하면 된다. code를 이해하지 못할 경우를 대비하여 message도 같이 보낸다.

code가 200번대 숫자가 아니라면 에러이고, 에러의 내용은 message에 담아 보내는 것으로 현재 API 서버의 규칙을 정했다.

라우터를 서버에 연결한다.

app.js
```js
const v1 = require('./routes/v1');
app.use('/v1', v1);
```

### 다른 서비스에서 호출하기
API 제공 서버를 만들었으니 API를 사용하는 서비스도 만들어야 한다. 이 서비스는 다른 서버에게 요청을 보내므로 클라이언트 역할을 한다. API 제공자가 아닌 API 사용자의 입장에서 진행하는 것이며, 바로 NodeBird 앱의 데이터를 가져오고 싶어 하는 사용자이다. 보통 그 데이터를 가공해 2차적인 서비스를 하려는 회사가 API를 이용하곤 한다. 예를 들어 쇼핑몰들이 있으면, 쇼핑몰들의 최저가를 알려주는 서비스가 2차 서비스가 된다. 지금 만들 2차 서비스의 이름은 NodeCat이다.

nodecat이라는 새로운 폴더를 만든다. 별도의 서버이므로 nodebird-api와 코드가 섞이지 않게 주의한다.

코드는 기존 코드와 거의 똑같으므로 생략

API를 사용하려면 먼저 사용자 인증을 받아야 하므로 사용자 인증이 원활하게 진행되는지 테스트하는 라우터를 만든다. 조금 전에 발급받은 clientSecret을 .env에 넣는다.

routes/index.js
```js
const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/test', async (req, res, next) => { // 토큰 테스트 라우터
  try {
    if (!req.session.jwt) { // 세션에 토큰이 없으면 토큰 발급 시도
      const tokenResult = await axios.post('http://localhost:8001/v1/token', {
        clientSecret: process.env.CLIENT_SECRET,
      });
      if (tokenResult.data && tokenResult.data.code === 200) { // 토큰 발급 성공
        req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
      } else { // 토큰 발급 실패
        return res.json(tokenResult.data); // 발급 실패 사유 응답
      }
    }
    // 발급받은 토큰 테스트
    const result = await axios.get('http://localhost:8001/v1/test', {
      headers: { authorization: req.session.jwt },
    });
    return res.json(result.data);
  } catch (error) {
    console.error(error);
    if (error.response.status === 419) { // 토큰 만료 시
      return res.json(error.response.data);
    }
    return next(error);
  }
});

module.exports = router;
```

GET /test 라우터는 NodeCat 서비스가 토큰 인증 과정을 테스트해보는 라우터이다. 이 라우터의 동작과정은 먼저 요청이 왔을 때 세션에 발급받은 토큰이 저장되어 있지 않다면, 토큰을 발급받는다. 이때 HTTP 요청의 본문에 클라이언트 비밀 키를 실어 보낸다.

발급에 성공했다면, 발급받은 토큰으로 다시 접근하여 토큰이 유효한지 테스트한다. 이 떄는 JWT 토큰을 요청 본문 대신 authorization 헤더에 넣었다. 보통 인증용 토큰은 이 헤더에 주로 넣어 전송한다.

실행을 해본다.

localhost:4000/test 로 접속을 하게 되면
```json
{"id":2,"nick":"전제","iat":1634532376,"exp":1634532436,"iss":"nodebird"}
```
이렇게 json 형식의 데이터가 화면에 나오게 된다.

1분이 지난뒤 다시 접속하면 만료되었다는 메시지가 뜬다.

```json
{"code":419,"message":"토큰이 만료되었습니다."}
```

토큰의 유효 기간인 1분이었으므로 1분 후에는 발급 받은 토큰을 갱신해야 한다. API 서버에서 에러 코드와 에러 메시지를 상새하게 보내줄수록 클라이언트가 무슨 일이 일어났는지 이해하기 쉽다. 토큰이 만료되었을 때 갱신하는 코드를 추가해야 한다는 것은 잊지 말아야 한다.

### SNS API 서버 만들기

다시 api로 넘어와서 나머지 라우터를 완성하겠다.

v1.js
```js
const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

router.post('/token', async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: {
        model: User,
        attribute: ['nick', 'id'],
      },
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
      });
    }
    const token = jwt.sign({
      id: domain.User.id,
      nick: domain.User.nick,
    }, process.env.JWT_SECRET, {
      expiresIn: '1m', // 1분
      issuer: 'nodebird',
    });
    return res.json({
      code: 200,
      message: '토큰이 발급되었습니다',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

router.get('/test', verifyToken, (req, res) => {
  res.json(req.decoded);
});

router.get('/posts/my', verifyToken, (req, res) => {
  Post.findAll({ where: { userId: req.decoded.id } })
    .then((posts) => {
      console.log(posts);
      res.json({
        code: 200,
        payload: posts,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: '서버 에러',
      });
    });
});

router.get('/posts/hashtag/:title', verifyToken, async (req, res) => {
  try {
    const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: '검색 결과가 없습니다',
      });
    }
    const posts = await hashtag.getPosts();
    return res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

module.exports = router;
```

GEt /posts/my 라우터와 GET /posts/hashtag/:title 라우터를 추가했다. 내가 올린 포스트와 해시태그 검색 결과를 가져오는 라우터이다. 이렇게 사용자에게 제공해도 되는 정보를 API로 만들면 된다.

사용하는 측에서는 위의 API를 이용하는 코드를 추가한다. 토큰을 발급받는 부분이 반복되므로 이를 함수로 만들어 재사용하는 것이 좋다.

nodecat/routes/index.js
```js
const express = require('express');
const axios = require('axios');

const router = express.Router();
const URL = 'http://localhost:8002/v1';

axios.defaults.headers.origin = 'http://localhost:4000'; // origin 헤더 추가 --- 1
const request = async (req, api) => {
  try {
    if (!req.session.jwt) { // 세션에 토큰이 없으면
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
    }
    return await axios.get(`${URL}${api}`, {
      headers: { authorization: req.session.jwt },
    }); // API 요청
  } catch (error) {
    if (error.response.status === 419) { // 토큰 만료시 토큰 재발급 받기
      delete req.session.jwt;
      return request(req, api);
    } // 419 외의 다른 에러면
    return error.response;
  }
}; // --- 1

router.get('/mypost', async (req, res, next) => {  // --- 2
  try {
    const result = await request(req, '/posts/my');
    res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
}); // --- 2

router.get('/search/:hashtag', async (req, res, next) => { // --- 3
  try {
    const result = await request(
      req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`,
    );
    res.json(result.data);
  } catch (error) {
    if (error.code) {
      console.error(error);
      next(error);
    }
  }
}); // --- 3

module.exports = router;
```
1. request 함수는 NodeBird API에 요청을 보내는 함수이다. 자주 재사용되므로 함수로 분리하였다. 먼저 요청의 헤더 origin 값을 localhost:4000으로 설정한다. 어디서 요청을 보내는지 파악하기 위해 사용하며, 나중에 주소가 바뀌면 이 값도 따라서 바꾸면 된다. 세션에 토큰이 없으면 clientSecret을 사용해 토큰을 발급받는 요청을 보내고, 발급받은 후에는 토큰을 이용해 API 요청을 보낸다. 토큰은 재사용을 위해 세션에 저장한다. 만약 토큰이 만료되면 419 에러가 발생하는데, 이때는 토큰을 지우고 request 함수를 재귀적으로 호출하여 다시 요청을 보낸다.

결괏값의 코드에 따라 성공 여부를 알 수 있고, 실패한 경우에도 실패 종류를 알 수 있으므로 사용자 입장에서 프로그래밍에 활용할 수 있다.

2. GET /mypost 라우터는 API를 사용해 자신이 작성한 포스트를 JSON 형식으로 가져오는 라우터이다. 현재는 JSON으로만 응답하지만 템플릿 엔진을 사용해 화면을 렌더링할 수도 있다.
3. GET /search/:hashtag 라우터는 API를 사용해 해시태그를 검색하는 라우터이다.

localhost:4000/mypost 에 접속을 하게 되면
```
{"code":200,"payload":[{"id":4,"content":"반갑다 갓냥이 킹로드다 ","img":"","createdAt":"2021-10-18T05:02:54.000Z","updatedAt":"2021-10-18T05:02:54.000Z","UserId":2}]}
```

이런 결과가 나온다. 

자신의 게시글 목록을 불러오는 것이기에 미리 nodebird 에 글을 작성하면 볼 수 있다. 클라이언트 비밀 키가 유출되면 다른 사람이 게시글을 가져갈 수도 있기에 조심해야 한다.

### 사용량 제한 구현하기
일차적으로 인증된 사용자만 API를 사용할 수 있게 필터를 두긴 했지만 아직 충분하지 않다. 인증된 사용자라고 해도 과도하게 API를 사용하면 서버에 무리가 가기때문에 일정 기간 내에 API를 사용할 수 있는 횟수를 제한하여 서버의 트래픽을 줄이는 것이 좋다. 유료 서비스라면 과금 체계별로 횟수에 차이를 둘 수도 있다. 

이러한 기능 또한 패키지로 존재하는데, 그 이름은 express-rate-limit 이다. api 서버에 설치를 한다.

verifyToken 미들웨어 아래에 apiLimiter 미들웨어와 deprecated 미들웨어를 추가한다.

routes/middlewares.js
```js
const RateLimit = require('express-rate-limit');

exports.apiLimiter = new RateLimit({
  windowMs: 60 * 1000, // 1분
  max: 10,
  delayMs: 0,
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode, // 기본값 429
      message: '1분에 한 번만 요청할 수 있습니다.',
    });
  },
});

exports.deprecated = (req, res) => {
  res.status(410).json({
    code: 410,
    message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
  });
};
```

이제 apiLimiter 미들웨어를 라우터에 넣으면 라우터에 사용량 제한이 걸ㄹ린다. 이 미들웨어의 옵션으로는 windowsMs, max, handler 등이 있다. 현재 설정은 1분에 한 번 호출 가능하게 되어 있다. 사용량 제한을 초과할 때는 429 상태 코드와 함께 허용량을 초과했다는 응답을 전송한다.

deprecated 미들웨어는 사용하면 안 되는 라우터에 붙여줄 것이다. 410 코드와 함께 새로운 버전을 사용하라는 메시지를 응답한다. 

사용량 제한이 추가되었으므로 기존 API 버전과 호환되지 않는다. 새로운 v2 라우터를 만든다.

routes/v2.js
```js
const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken, apiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

router.post('/token', apiLimiter, async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: {
        model: User,
        attribute: ['nick', 'id'],
      },
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
      });
    }
    const token = jwt.sign({
      id: domain.User.id,
      nick: domain.User.nick,
    }, process.env.JWT_SECRET, {
      expiresIn: '30m', // 30분
      issuer: 'nodebird',
    });
    return res.json({
      code: 200,
      message: '토큰이 발급되었습니다',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

router.get('/test', verifyToken, apiLimiter, (req, res) => {
  res.json(req.decoded);
});

router.get('/posts/my', apiLimiter, verifyToken, (req, res) => {
  Post.findAll({ where: { userId: req.decoded.id } })
    .then((posts) => {
      console.log(posts);
      res.json({
        code: 200,
        payload: posts,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: '서버 에러',
      });
    });
});

router.get('/posts/hashtag/:title', verifyToken, apiLimiter, async (req, res) => {
  try {
    const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: '검색 결과가 없습니다',
      });
    }
    const posts = await hashtag.getPosts();
    return res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

module.exports = router;
```
토큰 유효 기간을 30분으로 늘렸고, 라우터에 사용량 제한 미들웨어를 추가했다.

기존 v1 라우터를 사용할 때는 경고 메시지를 띄워준다.

v1.js
```js
const { verifyToken, deprecated } = require('./middlewares');
router.use(deprecated);
```

라우터 앞에 deprecated 미들웨어를 추가하여 v1으로 접근한 모든 요청에 deprecated 응답을 내도록 한다.

실제 서비스 운영 시에는 v2가 나왔다고 바로 닫아버리거나 410 에러로 응답하기보다는 일정한 기간을 두고 옮겨가는 것이 좋다. 사용자가 변경된 부분을 자신의 코드에 반영할 시간이 필요하기 때문이다. 

새로 만든 라우터를 서버와 연결한다.

nodecat으로 가서 새로 생긴 버전을 호출한다. 만약에 v1을 계속 사용한다면 아까 설정한 에러 메시지가 나오게 된다.

1분에 한 번보다 더 많이 API를 호출하면 429 에러가 발생한다.

실제 서비스에너는 서비스 정책에 맞게 제한량을 조절하면 된다.

현재는 nodebird-api 서버가 재시작되면 사용량이 초기화되므로 실제 서비스에서 사용량을 저장할 데이터베이스를 따로 마련하는 것이 좋다. 보통 레디스가 많이 사용된다. 단,express-rate-limit 은 데이터베이스와 연결하는 것을 지원하지 않으므로 npm에서 새로운 패키지를 찾아보거나 직접 구현해야 한다.

### CORS 이해하기
NodeCat이 nodebird-api를 호출하는 것은 서버에서 서버로 API를 호출한 것이다. 만약 NodeCat의 프론트에서 서버 API를 호출하면 어떻게 될까 ?

routes/index.js 에 프론트 화면을 렌더링하는 라우터를 추가한다.

routes/index.js
```js
router.get('/', (req, res) => {
    res.render('main', {key : process.env.CLIENT_SECRET});
});
```

views/main.html
```html
<!DOCTYPE html>
<html>
  <head>
    <title>프론트 API 요청</title>
  </head>
  <body>
  <div id="result"></div>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script>
    axios.post('http://localhost:8002/v2/token', {
      clientSecret: '{{key}}',
    })
      .then((res) => {
        document.querySelector('#result').textContent = JSON.stringify(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  </script>
  </body>
</html>
```

clientSecret 의 {{key}} 부분이 넌적스에 의해 실제 키로 치환돼서 렌더링된다. 단, 실제 서비스에서는 서버에서 사용하는 비밀 키와 프론트에서 사용하는 비밀 키를 따로 두는 것이 좋다. 보통 서버에서 사용하는 비밀 키가 더 강력하기 때문이다. 프론트에서 사용하는 비밀 키는 모든 사람에게 노출된다는 단점도 따른다. 데이터베이스에서 clientSecret 외에 frontSecret 같은 컬럼을 추가해서 따로 관리하는 것을 권장한다.

이 상태에서 localhost:4000에 접속하게 되면 Access-Control-Allow-Origin 이라는 헤더가 없다는 내용의 에러가 나온다. 이처럼 브라우저와 서버의 도메인이 일치하지 않으면 기본적으로 요청이 차단된다. 이 현상은 브라우저에서 서버로 요청을 보낼 때만 발생하고 서버에서 서버로 요청을 보낼 때는 발생하지 않는다. 현재 요청을 보내는 클라이언트와 요청을 받는 서버의 도메인이 다르다. 이 문제를 CORS 문제라고 부른다.

CORS 문제를 해결하기 위해서는 응답 헤더에 Access-Control-Allow-Origin 헤더를 넣어야 한다. 이 헤더는 클라이언트 도메인의 요청을 허락하겠다는 뜻을 가지고 있다. res.set 메서드로 직접 넣어도 되지만, npm 에는 편하게 설치할 수 있는 패키지가 있다. 바로 cors이다.

응답 헤더를 조작하려면 NodeCat이 아니라 NodeBird API 서버에서 바꿔야 한다. 응답은 API 서버가 보내는 것이기 때문이다. NodeBird API에 cors 모듈을 설치하면 된다.

설치 후 v2.js에 적용한다.

v2.js
```js
const cors = require('cors');
router.use(cors({
    credentials : true
}));
```

router.use로 v2의 모든 라우터에 적용했다. 이제 응답에 ACAO 헤더가 추가되어 나간다. credentials : true라는 옵션도 주었는데, 이 옵션을 활성화해야 다른 도메인 간에 쿠키가 공유된다. 서버 간의 도메인이 다른 경우에는 이 옵션을 활성화하지 않으면 로그인되지 않을 수 있다. 참고로 axios에서도 도메인이 다른데, 쿠키를 공유해야 하는 경우 withCredentials:true 옵션을 줘서 요청을 보내야 한다.

다시 접속해보면 토큰이 발급된 것을 볼 수 있다. 이 토큰을 사용해서 다른 API 요청을 보내면 된다. 토큰이 발급되지 않고 429 에러가 발생한다면, 이전에 적용한 사용량 제한 때문에 그런 것이므로 제한이 풀릴 때 다시 시도하면 된다.

응답 헤더를 보면 ACAO가 *로 되어 있는데 *는 모든 클라이언트의 요청을 허용한다는 뜻이다. credentials : true 옵션은 ACAO 헤더를 true로 만든다

하지만 이것 때문에 새로운 문제가 생겼다. 요청을 보내는 주체가 클라이언트라서 비밀 키가 모두에게 노출된다. 방금 CORS 요청도 허용했으므로 이 비밀키를 가지고 다른 도메인들이 API 서버에 요청을 보낼 수 있다.

이 문제를 막기 위해 처음에 비밀 키 발급 시 허용한 도메인을 적게 했다. 호스트와 비밀 키가 모두 일치할 때만 CORS를 허용하게 수정하면 된다.

v2.js
```js
const url = require('url');

router.use(async (req, res, next) => {
    const domain = await Domain.findOne({
        where : { host: url.parse(req.get('origin')).host}
    });
    if (domain){
        cors({
            origin : req.get('origin'),
            credentials: true
        })(req,res,next);
    }else {
        next();
    }
});
```

먼저 도메인 모델로 클라이언트의 도메인과 호스트가 일치하는 것이 있는지 검사한다. http 나 https 같은 프로토콜을 떼어낼 때는 url.parse 메서드를 사용한다. 일치하는 것이 있다면 cors를 허용해서 다음 미들웨어로 보내고, 없다면 CORS 없이 next를 호출한다. 

cors 미들웨어에 옵션 인수를 주었는데, origin 속성에 허용할 도메인만 따로 적으면 된다. *처럼 모든 도메인을 허용하는 대신 기입한 도메인만 허용한다. 여러 개의 도메인을 허용하고 싶다면 배열을 사용하면 된다.

또 하나 특이한 점이 있다. cors 미들웨어에 인수를 직접 줘서 호출했는데 이는 미드루에어의 작동 방식을 커스터마이징하고싶을 때 사용하는 방법이라고 설명했다.

##### API 만들기 끝

<hr>

## 노드 서비스 테스트하기
(저자의 말) 이번 장에서는 NodeBird 서비스에 테스팅을 적용해보겠습니다. 실제 서비스를 개발 완료한 후, 개발자나 QA들은 자신이 만든 서비스가 제대로 동작하는지 테스트해본다. 이때 기능이 많다면 일일이 수작업으로 테스트하기에는 작업량이 너무 많을 수 있다. 이런 경우 테스트를 자동화하여 프로그램이 프로그램을 테스트하도록 만들기도 한다.

또한, 테스트 환경과 실제 서비스 환경은 다르므로 테스트하는 데 제약이 따를 수도 있고, 테승트 결과와 실제 동작 결과가 다를 수도 있다. 이럴 때는 테스트 환경에서 실제 환경을 최대한 흉내 내서 작업한다.

단, 테스트를 아무리 철저하게 해도 에러를 완전히 막을 수는 없다. 보통 에러는 개발자가 예상하지 못한 케이스에서 발생하므로, 예상하지 못한다면 그에 대한 테스트로 작성할 수 없다. 하지만 모든 에러를 없앨 수 없더라도 테스트는 작성하는 게 좋다. 간단한 에러로 인해 프로그램이 고장나는 것은 막을 수 있기 떄문이다.

### 테스트 준비하기
테스트에 사용할 패키지는 jest 이다. 이 패키지는 페이스북에서 만든 오픈소스로, 테스팅에 필요한 툴들을 대부분 갖추고 있어 편리하다.

위에서 만든 nodebird 프로젝트를 그대로 사용하고, 여기에 jest 패키지를 설치한다. 테스팅 툴은 개발 시에만 사용하므로 -D 옵션을 사용한다.

console
```
npm i -D jest
```

package.json에는 test라는 명령어를 등록해둔다. 명령어를 실행할 때 jest가 실행된다.

package.json
```json
  "scripts": {
    "start": "nodemon app",
    "test" : "jest"
  },
```

routes 폴더 안에 middlewares.test.js를 만든다. 테스트용 파일은 파일명과 확장자 사이에 test나 spec을 넣으면 된다.

npm test로 테스트 코드를 실행할 수 있다. 파일명에 test나 spec이 들어간 파일들을 모두 찾아 실행한다.

console
```
npm test
```

실행을 하게되면 테스트를 아무것도 작성하지 않았으므로 에러가 발생한다. 이를 테스트가 실패했다고 표현한다. 첫번째 테스트 코드를 작성한다.

routes/middlewares.test.js
```js
test('1+1은 2입니다.', ()=> {
    expect(1+1).toEqual(2);
})
```

test 함수의 첫 번째 인수로는 테스트에 대한 설명을 적고, 두 번째 인수인 함수에는 테스트 내용을 적는다. expect 함수의 인수로 실제 코드를, toEqual 함수의 인수로 예상되는 결괏값을 넣으면 된다.

실행을 해보면 expect에 넣은 값과 toEqual에 넣은 값이 일치하면 테스트를 통과한다. 두 값을 다르게 해서도 테스트해보면 결괏값이 바뀐다.

테스트가 실패하면 정확히 어떤 부분에서 실패했는지 시각적으로 보여준다. 따라서 코드에 대해 테스트를 작성해두면 어떤 부분에 문제가 있는지 명확하게 파악할 수 있다.

### 유닛 테스트
이제 실제 NodeBird의 코드를 테스트 해본다. middlewares.js에 있는 isLoggedIn과 isNotLoggedIn 함수를 테스트 해보겠다

middlewares.test.js
```js
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

describe('isLoggedIn', () => {
    test('로그인되어 있으면 isLoggedIn이 next를 호출해야 함', () => {

    });
    test('로그인되어 있지 않으면 isLoggedIn이 에러를 응답해야 함', () => {

    });
})

describe('isNotLoggedIn', () => {
    test('로그인되어 있으면 isNotLoggedIn이 에러를 응답해야 함', () => {

    });
    test('로그인되어 있지 않으면 isNotLoggedIn이 next를 호출해야 함', () => {

    });
})
```

isLoggedIn 함수와 Not 함수를 불러와 네 개의 테스트를 작성했다. 아직 내용은 입력하지 ㅇ낳았다. describe 함수는 처음 보는 것일텐데, 이 함수는 테스트를 그룹화해주는 역할을 한다. test 함수와 마찬가지로 첫 번째 인수는 그룹에 대한 설명, 두 번째 인수인 함수는 그룹에 대한 내용이다.

middlewares.js를 보고 오면 실제 코드에서는 익스프레스가 req, res 객체와 next 함수를 인수로 넣었기에 사용할 수 있었지만, 테스트 환경에서는 어떻게 넣어야 할지 고민된다. req 객체에는 isAuthenticated 메서드가 존재하고 res 객체에도 status, send, redirect 메서드가 존재하는데, 코드가 성공적으로 실행되게 하려면 이것들을 모두 구현해야 한다.

이럴 때는 과감하게 가짜 객체와 함수를 만들어 넣으면 된다. 테스트의 역할은 코드나 함수가 제대로 실행되는지를 검사하고 값이 일치하는지를 검사하는 것이므로, 테스트 코드의 객체가 실제 익스프레스 객체가 아니어도 된다. 이렇게 가짜 객체, 가짜 함수를 넣는 행위를 모킹이라고 한다.

middleware.test.js
```js
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

describe('isLoggedIn', () => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test('로그인 되어있으면 isLoggedIn이 next를 호출해야 함', () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    isLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });

  test('로그인 되어있지 않으면 isLoggedIn이 에러를 응답해야 함', () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isLoggedIn(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.send).toBeCalledWith('로그인 필요');
  });
});

describe('isNotLoggedIn', () => {
  const res = {
    redirect: jest.fn(),
  };
  const next = jest.fn();

  test('로그인 되어있으면 isNotLoggedIn이 에러를 응답해야 함', () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    isNotLoggedIn(req, res, next);
    const message = encodeURIComponent('로그인한 상태입니다.');
    expect(res.redirect).toBeCalledWith(`/?error=${message}`);
  });

  test('로그인 되어있지 않으면 isNotLoggedIn이 next를 호출해야 함', () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isNotLoggedIn(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
```

먼저 isLoggedIn 부터 테스트해보겠다. req, res, next를 모킹했다. 함수를 모킹할 때는 jest.fn 메서드를 사용한다. 함수의 반환값을 지정하고 싶다면 jest.fn(()=>반환값)을 사용하면 된다. isAuthenticated는 로그인 여부를 알려주는 함수이므로 테스트 내용에 따라 true나 false를 반환하고, res.status는 res.status(403).send('hello') 처럼 메서드 체이닝이 가능해야 하므로 res를 반환하고 있다.

실제로는 req나 res 객체에 많은 속성과 메서드가 들어 있겠지만, 지금 테스트에서는 isAuthenticated나 status, send만 사용하므로 나머지는 과감하게 제외하면 된다. 

test 함수 내부에서는 모킹된 객체와 함수를 사용해 isLoggedIn 미들웨어를 호출한 후 expect로 원하는 내용대로 실행되었는지 체크하면 된다. toBeCalledTimes(숫자)는 정확하게 몇 번 호출되었는지를 체크하는 메서드고, toBeCalledWith(인수)는 특정 인수와 함께 호출되었는지를 체크하는 메서드이다. 

테스트를 돌려보면 모두 통과한다.

원하는 결과가 실행되었으므로 테스트를 통과한다. 황당하지만, 작성하지 않은 두 개의 테스트도 통과한다. 이것이 테스트를 한다고 해서 에러가 없음을 보장할 수없는 이유이다. 테스트 대상을 잘못 선정하거나 잘못된 방식으로 테스트한 경우에는 테스트를 작성했더라도 에러가 발생할 수 있다. 테스트를 올바르게 작성하는 데는 많은 훈련과 연습이 필요하다.

isNotLoggedIn 부분도 작성한다.

테스트는 통과할 것이다. 이렇게 작은 단위의 함수나 모듈이 의도된 대로 정확히 작동하는지 테스트하는 것을 유닛 테스트 또는 단위 테스트라고 부른다. 나중에 함수를 수정하면 기존에 작성해둔 테스트는 실패하게 된다. 따라서 함수가 수정되었을 때 어떤 부분이 고장나는지를 테스트를 통해 알 수 있다. 테스트 코드도 기존 코드가 벼경된 것에 맞춰서 수정해야 한다.

라우터와 긴밀하게 연결되어 있는 미들웨어도 테스트해보겠다. 단, 이때는 유닛 테스트를 위해 미들웨어를 분리해야 한다.

user.js를 다시 한번 보면 POST /:id/follow 라우터의 async 함수 부분은 따로 분리할 수 있다. controllers 폴더를 만들고 그 안에 user.js를 만든다. 라우터에서 응답을 보내는 미들웨어를 특별히 컨트롤러라고 부른다. 컨트롤러를 분리했으므로 routes/user.js도 따라서 수정한다.

controllers/user.js
```js
const User = require('../models/user');

exports.addFollowing = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
```

routes/user.js
```js
const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { addFollowing } = require('../controllers/user');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, addFollowing);

module.exports = router;****
```

이제 addFollowing 컨트롤러를 테스트해야 하는데, controllers/user.test.js를 작성한다.

user.test.js
```js
const { addFollowing } = require('../controllers/user');

describe('addFollowing', () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  const res = {
    send: jest.fn(),
  };
  const next = jest.fn();

  test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함', async () => {
    await addFollowing(req, res, next);
    expect(res.send).toBeCalledWith('success');
  });

  test('사용자를 못 찾으면 next(error)를 호출함', async () => {
    const error = '사용자 못 찾음';
    await addFollowing(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
```

addFollowing 컨트롤러가 async 함수이므로 await을 붙여야 컨트롤러가 실행 완료된 후 expect 함수가 실행된다. 그런데 이 테스트는 실패한다.

바로 User 모델 때문이다. addFollowing 컨트롤러 안에는 User라는 모델이 들어 있다. 이 모델은 실제 데이터베이스와 연결되어 있으므로 테스트 환경에서는 사용할 수 없다. 따라서 User 모델도 모킹해야 한다.

user.test.js
```js
jest.mock('../models/user');
const User = require('../models/user');
const { addFollowing } = require('../controllers/user');

describe('addFollowing', () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  const res = {
    send: jest.fn(),
  };
  const next = jest.fn();

  test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함', async () => {
    User.findOne.mockReturnValue(Promise.resolve({
      addFollowing(id) {
        return Promise.resolve(true);
      }
    }));
    await addFollowing(req, res, next);
    expect(res.send).toBeCalledWith('success');
  });

  test('사용자를 못 찾으면 next(error)를 호출함', async () => {
    const error = '사용자 못 찾음';
    User.findOne.mockReturnValue(Promise.reject(error));
    await addFollowing(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
```

jest.mock 메서드에 모킹할 모듈의 경로를 인수로 넣고, 그 모듈을 불러온다. jest.mock에서 모킹할 메서드에 mockReturnValue라는 메서드를 넣는다. 이 메서드로 가짜 반환값을 지정할 수 있다.

첫 번째 테스트에서는 mockReturnValue 메서드를 통해 User.findOne이 {addFollowing()} 객체를 반환하도록 했다. 사용자를 찾아서 팔로잉을 추가하는 상황을 테스트하기 위해서이다. 프로미스를 반환해야 다음에 await user.addFollowing 메서드를 호출할 수 있다. 두 번째 테스트에서는 null을 반환하여 사용자를 찾지 못한 상황을 테스트한다. 세 번째 테스트에서는 Promise.reject로 에러가 발생하도록 했다. DB 연결에 에러가 발생한 상황을 모킹한 것이다.

실제 데이터베이스에 팔로잉을 등록하는 것이 아니므로 제대로 테스트되는 것인지 걱정할 수도 있다. 이처럼 테스트를 해도 실제 서비스의 실제 데이터베이스에서는 문제가 발생할 수 있다. 그럴 때는 유닛 테스트 말고 다른 종류의 테스트를 진행해야 한다. 이를 점검하기 위해 통합 테스트나 시스템 테스트를 하곤 한다. 
