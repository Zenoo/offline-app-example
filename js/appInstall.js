let deferredPrompt;

window.addEventListener('beforeinstallprompt', e => {
	e.preventDefault();

	deferredPrompt = e;
	document.querySelector('.add-app').classList.add('shown');
});

window.addEventListener('load', () => {
	const 
		installButton = document.querySelector('.add-app button'),
		updateButton = document.querySelector('.update-app button');

	// Install app
	installButton.addEventListener('click', () => {
		installButton.parentElement.classList.remove('shown');

		deferredPrompt.prompt();
		deferredPrompt.userChoice
			.then((choiceResult) => {
				if (choiceResult.outcome === 'accepted') {
					console.log('User accepted the A2HS prompt');
				} else {
					console.log('User dismissed the A2HS prompt');
				}
				deferredPrompt = null;
			});
	});

	// Update app
	updateButton.addEventListener('click', () => {
		let newURL = new URL(location);

		newURL.searchParams.append('v', Math.random().toString(36).substring(7));

		window.location.href = newURL.href;
	});
	
	window.addEventListener('appinstalled', () => {
		console.log('App installed');
	});
});