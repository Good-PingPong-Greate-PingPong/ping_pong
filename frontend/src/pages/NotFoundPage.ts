import { Component } from "../core/Component";

export class NotFoundPage extends Component {
	template() {
		return `
		<div class="flex flex-col items-center justify-center h-screen bg-gray-100">
			<h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
			<p class="text-2xl text-gray-600 mb-8">페이지를 찾을 수 없습니다</p>
			<a href="#/" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
			홈으로 돌아가기
			</a>
		</div>
		
		`;
	}
}