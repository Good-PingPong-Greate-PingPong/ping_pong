import { Component } from "../core/Component";

export class Friend extends Component {
    setup() {
        const { id, nickname, profile_img } = this.$props.friendData;
        // console.log(this.$props)
        // console.log(id, nickname);

        this.setState({
            id:id,
            nickname:nickname,
            profile_img:profile_img,
        })
    }
    template(): string {
        const {id, nickname, profile_image} = this.$state;
        return `
        <div data-property-1="1" class="w-80 h-16 relative rounded-lg">
            <div class="w-72 left-[-0.10px] top-[-1.34px] absolute bg-white rounded-md inline-flex justify-between items-center">
                <div class="w-16 h-16 py-3 rounded-tl-md rounded-bl-md flex justify-end items-center gap-1.5">
                    <img class="w-12 h-12 rounded-[52.97px] outline outline-2 outline-mainColor" src="${profile_image}" />
                </div>
                <div class="justify-start text-black text-2xl font-extrabold font-['Inter']">${nickname} : ${id}</div>
                <div class="w-10 h-10 relative overflow-hidden">
                    <div class="w-8 h-8 left-[4.45px] top-[4.45px] absolute bg-mainColor"></div>
                </div>
                <div class="w-12 self-stretch bg-mainColor rounded-tr-md rounded-br-md flex justify-center items-center gap-1.5">
                    <div class="w-5 h-5 origin-top-left rotate-[43.75deg] bg-white border-[0.67px] border-black"></div>
                </div>
            </div>
        </div>
        `;
    }
}