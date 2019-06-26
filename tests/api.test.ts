import * as request from 'supertest'
import factory from '../src/server'

const body = 'Lorem ipsum delorum sit amet'
const wordCount = 5

const posts = [{
  title: 'My first post',
  slug: 'my-first-post',
  body,
  created: 1523401300000,
  tags: ['Algorithms', 'Java'],
  wordCount
}, {
  title: 'My second post',
  slug: 'my-second-post',
  body,
  created: 1523487600000,
  tags: ['Java'],
  wordCount
}, {
  title: 'My third post',
  slug: 'my-third-post',
  body,
  created: 152348760900,
  tags: ['Python'],
  wordCount
}, {
  title: 'My fourth post',
  slug: 'my-fourth-post',
  body,
  created: 152348760900,
  tags: ['Python', 'Algorithms'],
  wordCount
}]

const app = factory(posts)

describe('GET /posts', () => {
  test('all posts returned for GET /posts', () => 
    request(app)
      .get('/api/posts')
      .expect(200)
      .then(res => {
        expect(res.body.length).toBe(posts.length)
      })
  )

  test('posts filtered by tag correctly', () => {
    const tag = 'Algorithms'
    const filtered = posts.filter(p => p.tags.includes(tag))
    request(app)
      .get(`/api/posts?tag=${tag}`)
      .expect(200)
      .then(res =>
        expect(res.body.length).toBe(filtered.length)
      )
  })

  test('posts returned in sorted order', () => {
    const sorted = posts.sort((a, b) => b.created-a.created)
    request(app)
      .get('/api/posts')
      .expect(200)
      .then(res =>
        expect(res.body).toEqual(sorted)
      )
  })

  test('posts paged correctly', () => {
    request(app)
      .get('/api/posts?offset=1&limit=2')
      .expect(200)
      .then(res =>
        expect(res.body.length).toBe(2)  
      )
    request(app)
      .get('/api/posts?offset=2&limit=5')
      .expect(200)
      .then(res =>
        expect(res.body.length).toBe(2)
      )
  })
})

describe('GET /posts/:slug', () => {
  test('post can be fetched by slug', () => {
    const first = posts[0]
    request(app)
      .get(`/api/posts/${first.slug}`)
      .expect(200)
      .then(res =>
        expect(res.body).toEqual(first)
      );
  })

  test('404 response returned for non-existent post', () => 
    request(app)
      .get('/api/posts/my-fifth-post')
      .expect(404)
      .then(res => 
        expect(res.body).toEqual({
          error: {
            message: "404: No post with that slug"
          }
        })
      )
  )
})
