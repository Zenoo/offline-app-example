// Offline mode
if('serviceWorker' in navigator){
	navigator.serviceWorker
		.register('serviceWorker.js')
		.then(() => { 
			console.log('Service Worker Registered');
		});
}

/* global db */
// Database holder
let server;

// Retreive data from DB
const displayData = () => {
	const list = document.querySelector('.stored');

	list.innerHTML = '';

	server.data.query()
		.all()
		.execute()
		.then(results => {
			if(results.length){
				results.forEach(item => {
					const reader = new FileReader();

					// Display the current item
					list.innerHTML += `
						<li data-id="${item.id}">
							<p><img /></p>
							<p>${item.text}</p>
							<div>
								<p>${item.date}</p>
								<p>${item.number}</p>
							</div>
							<aside>Edit</aside>
						</li>
					`;

					// Display the item icon
					reader.addEventListener('load', () => {
						document.querySelector('li[data-id="'+item.id+'"] img').src = reader.result;
					});
					
					if(item.file) reader.readAsDataURL(item.file);

					// Listen to the edit event
					document.querySelector('li[data-id="'+item.id+'"] aside').addEventListener('click', () => {
						editItem(item);
					});
				});
			}else{
				list.innerHTML = `
					<li>
						<p>No item stored</p>
					</li>
				`;
			}
		});
};

const editItem = item => {
// Prefill old item info and handle the edition
};

window.addEventListener('load', () => {
	// Connect to DB
	db.open({
		server: 'test-data-storing',
		version: 1,
		schema: {
			data: {
				key: {
					keyPath: 'id', autoIncrement: true
				},
				indexes: {
					text: {},
					number: {},
					date: {},
					file: {}
				}
			}
		}
	}).then(s => {
		server = s;

		displayData();
	});

	// Save new data
	document.querySelector('form').addEventListener('submit', e => {
		e.preventDefault();

		let data = [...new FormData(e.target)].reduce((acc, [key, value]) => {
			acc[key] = value;
			return acc;
		}, {});

		server.data.add(data).then(() => {
			displayData();
		});
	});
});