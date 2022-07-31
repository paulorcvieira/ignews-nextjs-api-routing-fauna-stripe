import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('next-auth/react')
jest.mock('../../services/prismic')
jest.mock('next/router')

const date = new Date().toISOString()

const post = {
  slug: 'fake-my-new-post',
  title: 'Fake My New Post',
  content: '<p>Fake post excerpt</p>',
  updatedAt: date
}

describe('PostPreview - Page', () => {
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated"
    })
    
    render(<Post post={post} />)

    expect(screen.getByText('Fake My New Post')).toBeInTheDocument()
    expect(screen.getByText('Fake post excerpt')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects user to full post when user is subscribed', async () => {
    const useSessionMocked = jest.mocked(useSession)
    const useRouterMocked = jest.mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'John Doe',
          email: 'johndoe@example.com'
        },
        activeSubscription: 'fake-active-subscription',
        expires: 'fake-expires'
      },
      status: "authenticated"
    })

    useRouterMocked.mockReturnValueOnce({ push: pushMock } as any);

    render(<Post post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/fake-my-new-post')

  })

  it('loads initial data', async () => {

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

    const response = await getStaticProps({
      params: {
        slug: 'fake-my-new-post',
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            content: '<p>Fake post content</p>',
            slug: 'fake-my-new-post',
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