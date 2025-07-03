import { Component } from "../core/Component";

export class TwoFactorPage extends Component {
    setEvent(): void {
        this.addEvent("click", "#loginButton", () => {
            //구글 로그인 리다이렉트 처리
            console.log("로그인 리다이렉트");
        })
    }
    template() {
        return `
        <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div class="w-[500px] h-[462.97px] relative shadow-[0px_0px_15.47743034362793px_0px_rgba(0,0,0,0.25)]">
            <div class="w-[500px] h-96 left-0 top-0 absolute bg-gray rounded-2xl">
                <img class="w-44 h-44 left-[163px] top-[148px] absolute" src="https://placehold.co/175x174" />
                    <div class="left-[83px] top-[55px] absolute text-center justify-start text-mainColor text-3xl font-semibold font-['Inter']">Google OTP<br/> 인증 코드를 생성하세요. </div>
            </div>
            <div class="w-[500px] left-0 top-[370.10px] absolute inline-flex justify-between items-center">
                <div class="w-64 h-24 bg-stone-300 rounded-bl-2xl"></div>
                <div class="w-64 h-24 bg-mainColor rounded-br-2xl"></div>
            </div>
            <div class="w-16 h-10 left-[340.83px] top-[397.73px] absolute justify-start text-white text-4xl font-extrabold font-['Inter']">확인</div>
            <div class="w-16 h-10 left-[90.83px] top-[397.73px] absolute justify-start text-zinc-600 text-4xl font-extrabold font-['Inter']">취소</div>
        </div>
        </div>
        
        `;
    }
}