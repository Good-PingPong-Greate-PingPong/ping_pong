import { Component } from "../core/Component";

export class Profile extends Component {
    template() {
        return `
        <div class="w-full h-full flex flex-row p-16 bg-white rounded-b-lg rounded-tr-lg">
            <div > 프로필 사진 들어갈 자리</div>
            <form>
                <div>
                    <label for="name" class="text-lg font-bold">아이디</label>
                    <input class="text-base"></input>
                </div>
                <div>
                    <label for="languages" class="text-lg font-bold">언어 설정</label>
                    <select class="text-base">
                        <option value="EN">English</option>
                        <option value="KR">한국어</option>
                        <option value="FN">français</option>
                    </select>
                </div>
                <div>
                    <label for="twoFactor" class="text-lg font-bold">2차 인증</label>
                    <select class="text-base">
                        <option value="active">활성</option>
                        <option value="inactive">비활성</option>
                    </select>
                </div>
                    <input type='submit' value="수정">
            </form>
        </div>
        `;
    }
}