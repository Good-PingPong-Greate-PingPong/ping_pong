import { Component } from '../core/Component';
import { store } from '../core/store';
import { i18n } from '../types/i18n';
export class NotFoundPage extends Component {
  template() {
    const { language } = store.getState();
    const notFound = i18n[language].notFound;
	const goHome = i18n[language].goHome;

    return `
		<div class="flex flex-col items-center justify-center h-screen bg-gray-100">
			<h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
			<p class="text-2xl text-gray-600 mb-8">${notFound}</p>
			<a href="#/" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
			${goHome}
			</a>
		</div>
		
		`;
  }
}
