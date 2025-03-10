import logoutUrl from '../assets/logout.svg';

export function renderHomePage(): string {
  return `
	<div class="flex flex-row justify-around items-center border-2  w-full h-2/3">
		<ul class="border-2  min-h-60 flex flex-col justify-around items-center">
			<li class="min-w-40 min-h-16 bg-black rounded-lg flex flex-col justify-around"><a href="/local-game">로컬</a></li>
			<li class="min-w-40 min-h-16 bg-black rounded-lg flex flex-col justify-around"><a href="/tournament-game">토너먼트</a></li>
			<li class="min-w-40 min-h-16 bg-black rounded-lg flex flex-col justify-around"><a href="/">내 정보</a></li>
		</ul>
		<div class="bg-blue-100 w-80 min-h-48">gif 삽입 위치</div>
	</div>
	<footer class="border-2  w-full h-16 flex flex-row justify-end items-center">
		<div class="mr-3" id="logoutBtn">
			<img src="${logoutUrl}" alt="logout" class="w-8 h-8 cursor-pointer" >
		</div>
	 </footer>
  `;
}
