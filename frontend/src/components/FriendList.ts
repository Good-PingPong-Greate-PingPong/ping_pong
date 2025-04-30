import { Component } from "../core/Component";
import { Friend } from "./friend";

interface IFriend {
    id: number;
    nickname: string;
    profile_img: string;
}

const mockData = {
    "data": {
        "total_page": 5,
        "current_page": 1,
        "friends": [
        {
            "id": 1,
            "nickname": "민수",
            "profile_image": "http://example.com/minsu.jpg"
        },
        {
            "id": 2,
            "nickname": "지영",
            "profile_image": "http://example.com/jiyoung.jpg"
        },
        {
            "id": 3,
            "nickname": "현우",
            "profile_image": "http://example.com/hyunwoo.jpg"
        },
        {
            "id": 4,
            "nickname": "서연",
            "profile_image": "http://example.com/seoyeon.jpg"
        }
        ]
    }
    };

export class FriendsList extends Component {

    setup() {
        this.setState({
            friends: mockData.data.friends,
            currentPage: mockData.data.current_page,
            totalPage: mockData.data.total_page

        })
    }
    
    template(): string {
        return `
        <div class="w-full h-full p-16 bg-white rounded-b-lg rounded-tr-lg">
            <div class="flex flex-row justify-end">
                <div class="w-60 h-11 bg-white rounded-[10px] border-[3px] border-default"></div>
                <div>icon</div>
            </div>
            <div class=" flex flex-row justify-around items-center">
                <div> < </div>
                <div class="">
                ${this.$state.friends.map((_:IFriend, index:number) => `
                    <div data-component="friend-${index}" class="">contents</div>
                    `).join('')}
                </div>
                <div> > </div>
            </div>
            </div>
        </div>
        `;
    }

    mounted(): void {
        // const $friends = this.$target.querySelector('[data-component="friends"]') as HTMLElement;

        // new Friend($friends);

        if (this.$state.friends) {

            this.$state.friends.forEach((friend: IFriend, index:number) => {
                const $friendContainer = this.$target.querySelector(`[data-component="friend-${index}"]`) as HTMLElement;
                if ($friendContainer) {
                    new Friend($friendContainer, {friendData: friend});
                }
            })
        }
    }
}