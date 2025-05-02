import { Component } from "../core/Component";

export class LoginPage extends Component {
    setEvent(): void {
        this.addEvent("click", "#loginButton", () => {
            //구글 로그인 리다이렉트 처리
            console.log("로그인 리다이렉트");
        })
    }
    template() {
        return `
        <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
            <button id="loginButton"> 구글 계정으로 로그인 </button>
        </div>
        
        `;
    }
}