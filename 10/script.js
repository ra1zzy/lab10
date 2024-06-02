document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productInput = document.getElementById('product-input');
    const submitBtn = document.getElementById('submit-btn');
    const productList = document.getElementById('product-list');
    const clearBtn = document.getElementById('clear-btn');
    const modal = document.getElementById('modal');
    let editElement;
    let editFlag = false;
    let editID = '';

    // Load products from localStorage
    loadProducts();

    // Form submit handler
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = productInput.value.trim();
        const id = new Date().getTime().toString();

        if (value && !editFlag) {
            createProductElement(id, value);
            displayModal('Product added');
            addToLocalStorage(id, value);
            setBackToDefault();
        } else if (value && editFlag) {
            editElement.innerHTML = value;
            displayModal('Product edited');
            editLocalStorage(editID, value);
            setBackToDefault();
        }
    });

    // Clear list button handler
    clearBtn.addEventListener('click', () => {
        const items = document.querySelectorAll('.product-item');
        if (items.length > 0) {
            items.forEach(item => {
                productList.removeChild(item);
            });
            displayModal('List cleared');
            localStorage.removeItem('products');
            setBackToDefault();
        }
    });

    // Create product element
    function createProductElement(id, value) {
        const element = document.createElement('article');
        element.setAttribute('data-id', id);
        element.classList.add('product-item');
        element.innerHTML = `
            <p class="title">${value}</p>
            <div class="btn-container">
                <button type="button" class="edit-btn">Edit</button>
                <button type="button" class="delete-btn">Delete</button>
            </div>
        `;

        const editBtn = element.querySelector('.edit-btn');
        const deleteBtn = element.querySelector('.delete-btn');

        // Delete product
        deleteBtn.addEventListener('click', () => {
            const id = element.dataset.id;
            productList.removeChild(element);
            displayModal('Product removed');
            removeFromLocalStorage(id);
            setBackToDefault();
        });

        // Edit product
        editBtn.addEventListener('click', () => {
            editElement = element.querySelector('.title');
            productInput.value = editElement.innerHTML;
            editFlag = true;
            editID = element.dataset.id;
            submitBtn.textContent = 'Edit';
        });

        productList.appendChild(element);
    }

    // Display modal message
    function displayModal(text) {
        modal.textContent = text;
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 2000);
    }

    // Set back to default state
    function setBackToDefault() {
        productInput.value = '';
        editFlag = false;
        editID = '';
        submitBtn.textContent = 'Add';
    }

    // Add to local storage
    function addToLocalStorage(id, value) {
        const products = getLocalStorage();
        products.push({ id, value });
        localStorage.setItem('products', JSON.stringify(products));
    }

    // Remove from local storage
    function removeFromLocalStorage(id) {
        let products = getLocalStorage();
        products = products.filter(product => product.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
    }

    // Edit local storage
    function editLocalStorage(id, value) {
        let products = getLocalStorage();
        products = products.map(product => {
            if (product.id === id) {
                product.value = value;
            }
            return product;
        });
        localStorage.setItem('products', JSON.stringify(products));
    }

    // Get local storage
    function getLocalStorage() {
        return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    }

    // Load products
    function loadProducts() {
        const products = getLocalStorage();
        products.forEach(product => {
            createProductElement(product.id, product.value);
        });
    }
});
