export class Component {
$target: HTMLElement; // 컴포넌트가 렌더링될 DOM 요소
$props: Record<string, any>;  // 부모 컴포넌트로부터 전달받은 속성(props)
$state: Record<string, any> = {};  // 컴포넌트의 상태(state)
//Record<K, T>는 객체 타입을 정의하는 데 사용됩니다.
// 생성자: 컴포넌트를 초기화하고 렌더링을 수행

constructor ($target: HTMLElement, $props: Record<string, any> = {}) {
    this.$target = $target; // 렌더링 대상 DOM 요소 저장
    this.$props = $props;   // 부모로부터 전달받은 props 저장
    this.setup();           // 초기 상태(state) 설정
    this.setEvent();        // 이벤트 등록
    this.render();          // 초기 렌더링 수행
}

// 초기 상태(state)를 설정하는 메서드 (하위 클래스에서 오버라이드)
setup () {};

// 컴포넌트가 렌더링된 후 추가 작업을 수행하는 메서드 (하위 클래스에서 오버라이드)
mounted () {};

// 컴포넌트의 HTML 구조를 반환하는 메서드 (하위 클래스에서 오버라이드)
template () { return ''; }

// 컴포넌트를 화면에 렌더링하는 메서드
render () {
    this.$target.innerHTML = this.template(); // template() 메서드로 HTML 생성 후 렌더링
    this.mounted(); // 렌더링 후 추가 작업 수행
}

// 컴포넌트의 이벤트를 설정하는 메서드 (하위 클래스에서 오버라이드)
setEvent () {}

// 상태(state)를 업데이트하고 다시 렌더링하는 메서드
setState (newState: Record<string, any>): void {
    this.$state = { ...this.$state, ...newState }; // 기존 상태와 새로운 상태 병합
    this.render(); // 상태 변경 후 다시 렌더링
}

// 특정 DOM 요소에 이벤트를 등록하는 헬퍼 메서드
addEvent(eventType: string, selector: string, callback: (event: Event) => void): void {
    this.$target.addEventListener(eventType, (event: Event) => {
      // 이벤트가 발생한 요소가 selector와 일치하지 않으면 무시
    const target = event.target as Element;
    if (!target.closest(selector)) return false;
      callback(event); // selector와 일치하면 콜백 실행
    });
}

}

