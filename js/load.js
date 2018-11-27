/* global db, OfflineHandler */

// Offline availability
new OfflineHandler([
	'lib/db.js/js/db.min.js',
	'js/load.js',
	'css/style.min.css'
]);

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
							<p class="item-icon"><img /></p>
							<p class="item-name">${item.text}</p>
							<div>
								<p class="item-date">${item.date}</p>
								<p class="item-price">${item.number}$</p>
							</div>
							<div>
								<aside class="item-edit">Edit</aside>
								<aside class="item-delete">Delete</aside>
							</div>
						</li>
					`;

					// Display the item icon
					reader.addEventListener('load', () => {
						document.querySelector('li[data-id="'+item.id+'"] img').src = reader.result;
					});
					
					if(item.file) reader.readAsDataURL(item.file);

					// Listen to the edit event
					document.querySelector('li[data-id="'+item.id+'"] aside.item-edit').addEventListener('click', () => {
						console.log('edit');
						editItem(item);
					});

					// Listen to the delete event
					document.querySelector('li[data-id="'+item.id+'"] aside.item-delete').addEventListener('click', () => {
						deleteItem(item);
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
	const 
		formSection = document.querySelector('.edit-item'),
		form = formSection.querySelector('form');

	document.querySelector('.add-item').classList.remove('running');

	form.elements.id.value = item.id;
	form.elements.text.value = item.text;
	form.elements.number.value = item.number;
	form.elements.date.value = item.date;
	form.querySelector('img').replaceWith(document.querySelector('li[data-id="'+item.id+'"] .item-icon img').cloneNode());

	// Icon preview change
	form.querySelector('img').addEventListener('click', e => {
		e.target.nextElementSibling.click();
	});

	formSection.classList.add('active');
};

const deleteItem = item => {
	server.data.remove(item.id).then(() => {
		document.querySelector('li[data-id="'+item.id+'"]').remove();
	});
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

	// Add new item
	const addButton = document.querySelector('.add-item');
	
	addButton.addEventListener('click', () => {
		const editSection = document.querySelector('.edit-item');

		addButton.classList.add('running');
		editSection.classList.add('active');
		editSection.querySelector('form').reset();
		editSection.querySelector('img').src = '';
		editSection.querySelector('input[name="id"]').value = '';

	});

	// Icon preview change
	const form = document.querySelector('form');

	form.querySelector('img').addEventListener('click', e => {
		e.target.nextElementSibling.click();
	});

	form.elements.file.addEventListener('change', () => {
		if(form.elements.file.files && form.elements.file.files[0]){
			const reader = new FileReader();

			reader.addEventListener('load', e => {
				form.querySelector('img').src = e.target.result;
			});

			reader.readAsDataURL(form.elements.file.files[0]);
		}
	});

	// Save new data
	document.querySelector('form').addEventListener('submit', e => {
		e.preventDefault();

		let data = [...new FormData(e.target)].reduce((acc, [key, value]) => {
			acc[key] = value;
			return acc;
		}, {});

		delete data.id;

		server.data.add(data).then(() => {
			displayData();
			addButton.classList.remove('running');
			form.reset();
			document.querySelector('.edit-item').classList.remove('active');
		});
	});
});