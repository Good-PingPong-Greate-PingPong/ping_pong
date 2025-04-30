import { Component } from "../core/Component";

export class GameHistory extends Component {
    template(): string {
        return `
        <div class="w-full h-full p-16 bg-white rounded-b-lg rounded-tr-lg">
            <div class="flex flex-row justify-end">
                    <div class="w-[70px] h-6  bg-black rounded inline-flex justify-center items-center gap-1.5">
                        <div class="text-center justify-center text-white text-base font-extrabold font-['Inter']">토너먼트</div>
                    </div>
                    <div class="w-[70px] h-6 bg-gray-100 rounded inline-flex justify-center items-center gap-1.5">
                        <div class="text-center justify-center text-black text-base font-extrabold font-['Inter']">로컬</div>
                    </div>
                </div>
            <div class=" flex flex-row justify-center">
                <div> < </div>
                <div data-component="friends" class="">contents</div>
                <div> > </div>
            </div>
            </div>
        </div>
        `;
    }
}