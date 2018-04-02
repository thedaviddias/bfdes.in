import * as request from 'supertest'
import { factory } from '../src/server'

const fixture = {
  'my-first-post': {
    title: 'My first post',
    body: 'Lorem ipsum delorum sit amet',
    created: 1523401200000,
    tags: ['Algorithms', 'Java'],
    wordCount: 5
  },
  'my-second-post': {
    title: 'My second post',
    body: 'Lorem ipsum delorum sit amet',
    created: 1523487600000,
    tags: ['Java'],
    wordCount: 5
  }
}

const app = factory(fixture)

describe('test GET /posts', () => {
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
      .then(res => {
        expect(res.body.length).toBe(1)
      })
  )
})

describe('test GET /posts/:slug', () => {
  test('post can be fetched by slug', () => {
    request(app)
      .get('/api/posts/my-first-post')
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          title: 'My first post',
          body: 'Lorem ipsum delorum sit amet',
          created: 1523401200000,
          tags: ['Algorithms', 'Java'],
          wordCount: 5
        })
      })
  })

  test('404 response returned for non-existent post', () => {
    request(app)
      .get('/api/posts/my-third-post')
      .expect(404)
      .then(res => {
        expect(res.body).toEqual({
          error: {
            message: "404: No post with that slug"
          }
        })
      })
  })
})
