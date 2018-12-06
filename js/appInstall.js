let deferredPrompt;

window.addEventListener('beforeinstallprompt', e => {
	// Prevent Chrome 67 and earlier from automatically showing the prompt
	e.preventDefault();
	// Stash the event so it can be triggered later.
	deferredPrompt = e;
	document.querySelector('.add-app').classList.add('shown');
});

window.addEventListener('load', () => {
	const installButton = document.querySelector('.add-app button');

	installButton.addEventListener('click', () => {
		// hide our user interface that shows our A2HS button
		installButton.parentElement.classList.remove('shown');
		// Show the prompt
		deferredPrompt.prompt();
		// Wait for the user to respond to the prompt
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
	
	window.addEventListener('appinstalled', () => {
		console.log('App installed');
	});
});