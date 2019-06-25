import * as request from 'supertest'
import factory from '../src/server'

const posts = [{
  title: 'My first post',
  slug: 'my-first-post',
  body: 'Lorem ipsum delorum sit amet',
  created: 1523401200000,
  tags: ['Algorithms', 'Java'],
  wordCount: 5
}, {
  title: 'My second post',
  slug: 'my-second-post',
  body: 'Lorem ipsum delorum sit amet',
  created: 1523487600000,
  tags: ['Java'],
  wordCount: 5
}]

const app = factory(posts)

describe('GET /posts', () => {
  test('all posts returned for GET /posts', () => 
    request(app)
      .get('/api/posts')
      .expect(200)
      .then(res => {
        expect(res.body.length).toBe(2)
      })
  )

  test('posts filtered by tag correctly', () => 
    request(app)
      .get('/api/posts?tag=Algorithms')
      .expect(200)
      .then(res =>
        expect(res.body.length).toBe(1)
      )
  )
})

describe('GET /posts/:slug', () => {
  test('post can be fetched by slug', () => {
    const first = posts[0]
    return request(app)
      .get(`/api/posts/${first.slug}`)
      .expect(200)
      .then(res =>
        expect(res.body).toEqual(first)
      );
  })

  test('404 response returned for non-existent post', () => 
    request(app)
      .get('/api/posts/my-third-post')
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
