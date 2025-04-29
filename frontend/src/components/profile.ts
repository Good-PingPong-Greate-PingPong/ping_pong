import { Component } from "../core/Component";

export class Profile extends Component {
    template() {
        return `
        <div class="w-full h-full bg-red-100 flex flex-row p-16">
            <div > 프로필 사진 들어갈 자리</div>
            <form>
                <div>
                    <h1 class="text-lg font-bold">닉네임<h1>
                    <input class="text-base"></input>
                </div>
                <div>
                    <h1 class="text-lg font-bold">언어 설정<h1>
                    <select class="text-base">
                        <option value="EN">English</option>
                        <option value="KR">한국어</option>
                        <option value="FN">français</option>
                    </select>
                </div>
                <div>
                    <h1 class="text-lg font-bold">2차 인증<h1>
                    <select class="text-base">
                        <option value="active">활성</option>
                        <option value="inactive">비활성</option>
                    </select>
                </div>
            </form>
        </div>
        `;
    }
}