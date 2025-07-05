import { Component } from '../core/Component';
import { store } from '../core/store';
import { Language } from '../types';

export class LanguageSetting extends Component {
  setEvent() {
    // 언어 선택 변경 시 store의 language 값 변경
    this.addEvent('change', 'select.text-base', (event: Event) => {
      const target = event.target as HTMLSelectElement;
      const selectedLang = target.value as keyof typeof Language;
      store.setState({ language: Language[selectedLang] });
    });
  }
  template(): string {
    const { language } = store.getState();
    return `
        <div class="w-full h-full p-16 bg-backgroundColor rounded-b-lg rounded-tl-lg">
            <div class="flex flex-row justify-end">
                  <div>
                    <label for="languages" class="text-lg font-bold">언어 설정</label>
                    <select class="text-base">
                        <option value="EN" ${language === Language.EN ? 'selected' : ''}>English</option>
                        <option value="KR" ${language === Language.KR ? 'selected' : ''}>한국어</option>
                        <option value="FN" ${language === Language.FN ? 'selected' : ''}>français</option>
                    </select>
                </div>
            </div>
        </div>
        `;
  }
}
