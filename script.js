class UpdateUI {
  constructor() {
    this.postsContainer = document.getElementById('posts-container');
    this.loading = document.querySelector('.loader');
    this.limit = 5;
    this.page = 1;
    document.addEventListener('scroll', this.calculate.bind(this));
    this.isLoading = false;
    this.filter = document.getElementById('filter');
    this.fetchedPosts = [];
  }

  async calculate() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      if (this.isLoading) {
        return;
      } 
      this.page++;
      this.loading.classList.add('show');
      this.isLoading = true;

      setTimeout(() => {
        this.updateUI(this.limit, this.page);
        this.loading.classList.remove('show');
        this.isLoading = false;
      }, 500);
    }
  }

  async updateUI() {
    const postEl = await Loader.getPost(this.limit, this.page)
    postEl.forEach(this.updateEach.bind(this));
    //postEl.sort((a, b) => a.id < b.id ? -1 : 1);
    new Filter();
  }

  updateEach(el) {
    const post = document.createElement('div');
    post.classList.add('post');
    post.innerHTML = `
    <div class="number">${el.id}</div>
    <div class="post-info">
    <h2 class="post-title">${el.title}</h2>
    <p class="post-body">${el.body}</p>
    </div>
    `
      this.postsContainer.appendChild(post)
  }
}

class Filter {
  constructor() {
    this.filter = document.getElementById('filter');
    this.filter.addEventListener('keyup', this.search.bind(this))
  }
   
  // search() {
  //   const value = this.filter.value.toLowerCase();
  //   const postsContainer = document.getElementById('posts-container');
  //   const postItems = postsContainer.querySelectorAll('.post');
  //   postItems.forEach(el => {
  //     const title = el.querySelector('.post-title').textContent.toLowerCase();
  //     const body = el.querySelector('.post-body').textContent.toLowerCase();
  //     if (title.includes(value) || body.includes(value)) {
  //       el.classList.add('visible');
  //       el.classList.remove('hidden');
  //     } else {
  //       el.classList.add('hidden');
  //       el.classList.remove('visible');
  //     }
  //   });
  // }

  search() {
    const value = this.filter.value.toLowerCase();
    const postsContainer = document.getElementById('posts-container');
    const postItems = postsContainer.querySelectorAll('.post');
    postItems.forEach(el => {
      if (!el.textContent.includes(value)) {
        el.style.display = "none";
      } else {
        el.style.display = "flex";
      };
    })
  }
}

class Loader {
  static async getPost(limit, page) {
    const posts = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`)
    const data = await posts.json();
    return data;
  }
}

const updateUI = new UpdateUI()
updateUI.updateUI()
