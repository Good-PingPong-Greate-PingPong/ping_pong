import { store } from "./store";

interface RouteDefinition {
    fragmentRegExp: RegExp;
    component: ComponentConstructor;
    params: string[];
}

// 컴포넌트 생성자 타입 정의
interface ComponentConstructor {
new(target: HTMLElement, params?: Record<string, string>): any;
}


export class Router {
private routes: RouteDefinition[] = [];
private readonly ROUTE_PARAMETER_REGEXP: RegExp = /:(\w+)/g;
private readonly URL_REGEXP: string = '([^\\/]+)';
private $target: HTMLElement;
private notFoundPage: ComponentConstructor | null = null;

constructor($target: HTMLElement) {
    this.routes = []; // 애플리케이션 경로 목록
    this.$target = $target;
}
setNotFound(component: ComponentConstructor): Router {
    this.notFoundPage = component;
    return this;
}

// 경로 목록 추가
addRoute(fragment: string, component: ComponentConstructor): Router {
    const params: string[] = [];
    fragment = fragment.replace('#', '');
    //fragment는 replace 함수를 통해 parsedFragment로 치환됩니다.
    const parsedFragment = fragment.replace(this.ROUTE_PARAMETER_REGEXP, (_, paramName) => {
    params.push(paramName); // path parameter 이름을 추출하여 배열에 넣어줍니다. ["name", "song"]
    return this.URL_REGEXP; // path parameter에 매치되는 문자를 URL_REGEXP로 치환합니다.
    }).replace(/\//g, "\\/"); // "/" 의 텍스트로써 사용을 위해 모든 "/" 앞에 이스케이프 문자("\")를 추가해줍니다.
    
    this.routes.push({
    fragmentRegExp: new RegExp(`^${parsedFragment}$`), // 정규식 생성
    component,
    params,
    });
    return this;
}

// 현재 url이 변경되면 콘텐츠를 해당 url에 매칭된 요소로 교체
start(): void {
    // if (!window.location.hash){
    //     window.location.hash = "#/";
    // }
    // 체크라우트 함수를 바인딩하여 이벤트 리스너에서 this 참조가 유지되도록 함
    const checkRoutes = this.checkRoutes.bind(this);
    window.addEventListener('hashchange', checkRoutes); // 브라우저 hash 값이 변경될 때 발생 이벤트
    checkRoutes();
}


// URL 파라미터 추출 메서드
private getUrlParams(route: RouteDefinition, hash: string): Record<string, string> {
    const params: Record<string, string> = {};
    const matches = hash.match(route.fragmentRegExp); //URL과 정규식 매칭
    
    if (!matches) return params;
    
    matches.shift(); //첫 번째 요소(전체 매치) 제거
    matches.forEach((paramValue, index) => {
    const paramName = route.params[index]; //해당 인덱스의 파라미터 이름 가져오기
    params[paramName] = paramValue; // 이름-값 쌍으로 객체에 저장
    });
    // params = {name: 'IU', song: 'raindrop'}
    return params;
}

// 라우트 체크 및 컴포넌트 렌더링
private checkRoutes(): void {

    const currentHash = window.location.hash.replace('#', '') || '/';

      // 인증이 필요한 경로 목록 (예시)
    const protectedRoutes = ['/', '/tournament-game', '/local-game'];
    if (protectedRoutes.includes(currentHash)) {
        const { user } = store.getState();
        if (!user) {
            console.log("router: 유저 정보가 없습니다. ")
            window.location.hash = '#/login';
            return;
        }
    }


    const currentRoute = this.routes.find(route => route.fragmentRegExp.test(currentHash)); // 정규표현식과 일치하면 true, #을 제거하고 빈 문자열도 처리
    if (currentRoute) {
    if (currentRoute.params.length) {
        // path parameters가 있는 url인 경우 // 필요없으면 지울것 TODO
        const urlParams = this.getUrlParams(currentRoute, window.location.hash);
        // this.$target.innerHTML = '';
        new currentRoute.component(this.$target, urlParams);
    } else {
        new currentRoute.component(this.$target);//페이지 이동을 보여주기 위해 변경하는 메서드
    }
    } else {
        if (this.notFoundPage){
            new this.notFoundPage(this.$target);
        } else {
            this.$target.innerHTML = "404";
        }
    }
}

// 네비게이션 메서드
// navigate(fragment: string, replace: boolean = false): void {
//     if (replace) {
//     const href = window.location.href.replace(window.location.hash, "#" + fragment);
//     window.location.replace(href);
//     } else {
//     window.location.hash = fragment;
//     }
// }
}

export function navigate(fragment: string, replace: boolean = false) {




	if (replace) {
        // 뒤로가기 막기
		const href = window.location.href.replace(window.location.hash, "#" + fragment);
		window.location.replace(href);
	} else {
		window.location.hash = fragment;
	}
}