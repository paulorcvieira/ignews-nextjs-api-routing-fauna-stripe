import { render, screen } from '@testing-library/react'
import { getSession, useSession } from 'next-auth/react'

import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'

jest.mock('next-auth/react')
jest.mock('../../services/prismic')

const date = new Date().toISOString()

const post = {
  slug: 'fake-my-new-post',
  title: 'Fake My New Post',
  content: '<p>Fake post excerpt</p>',
  updatedAt: date
}

describe('Post - Page', () => {
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated"
    })
    
    render(<Post post={post} />)

    expect(screen.getByText('Fake My New Post')).toBeInTheDocument()
    expect(screen.getByText('Fake post excerpt')).toBeInTheDocument()
  })

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = jest.mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: { slug: 'fake-my-new-post' }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/posts/preview/fake-my-new-post'
        })
      })
    )

  })

  it('loads initial data', async () => {
    const getSessionMocked = jest.mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

    const getPrismicClientMocked = jest.mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'Fake My New Post' }
          ],
          content: [
            { type: 'paragraph', text: 'Fake post content' }
          ],
        },
        last_publication_date: date
      })
    } as any)

    const response = await getServerSideProps({
      params: { slug: 'fake-my-new-post' }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'fake-my-new-post',
            content: '<p>Fake post content</p>',
            title: "Fake My New Post",
            updatedAt: new Date(date).toLocaleDateString(
              'pt-BR',
              {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              },
            )
          }
        }
      })
    )
  })
})