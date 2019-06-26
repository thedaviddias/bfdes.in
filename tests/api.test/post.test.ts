import * as request from 'supertest'
import factory from '../../src/server'

const post = {
  title: 'My first post',
  slug: 'my-first-post',
  body: 'Lorem ipsum delorum sit amet',
  created: 1523401300000,
  tags: ['Algorithms', 'Java'],
  wordCount: 5
}

const app = factory([post])

describe('GET /posts/:slug', () => {
  test('post can be fetched by slug', () => {
    request(app)
      .get(`/api/posts/${post.slug}`)
      .expect(200)
      .then(res =>
        expect(res.body).toEqual(post)
      );
  })

  test('404 response returned for non-existent post', () => 
    request(app)
      .get('/api/posts/my-second-post')
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
