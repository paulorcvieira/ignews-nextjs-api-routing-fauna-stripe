import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'

import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'

jest.mock('next-auth/react')
jest.mock('../../services/prismic')

const date = new Date().toISOString()

const posts = [
  {
    slug: 'fake-my-new-post',
    title: 'Fake My New Post',
    excerpt: 'Fake post excerpt',
    updatedAt: date
  }
]

describe('Posts - Page', () => {
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated"
    })
    
    render(<Posts posts={posts} />)

    expect(screen.getByText('Fake My New Post')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'fake-my-new-post',
            data: {
              title: [
                { type: 'heading', text: 'Fake My New Post' }
              ],
              content: [
                { type: 'paragraph', text: 'Fake post excerpt' }
              ],
            },
            last_publication_date: date
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(expect.objectContaining({
      props: {
        posts: [{
          slug: 'fake-my-new-post',
          title: 'Fake My New Post',
          excerpt: 'Fake post excerpt',
          updatedAt: new Date(date).toLocaleDateString(
            'pt-BR',
            {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            },
          )
        }]
      }
    }))
    
  })
})