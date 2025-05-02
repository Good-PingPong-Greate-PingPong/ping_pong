import { Component } from '../core/Component';
export class TournamentGamePage extends Component {
	template () { return `
		<div class="w-full bg-blue-100">
			<h1>게임 페이지</h1>
			<p>이 페이지는 토너먼트게임 페이지입니다.</p>
			<div class="w-full bg-green-100">div
			</div>
		</div>
	`; 
	}
	render () {
		this.$target.innerHTML = this.template(); // template() 메서드로 HTML 생성 후 렌더링
	}
}