import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'

import Home, { getStaticProps } from '../../pages'
import { stripe } from '../../services/stripe'

jest.mock('next/router')
jest.mock('next-auth/react')
jest.mock('../../services/stripe')

describe('Home - Page', () => {
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated"
    })
    
    render(<Home product={{ priceId: 'fake-price-id', amount: '$ 10,00' }} />)

    expect(screen.getByText('For $ 10,00')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const retrieveStripePricesMocked = jest.mocked(stripe.prices.retrieve)

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(expect.objectContaining({
      props: {
        product: {
          priceId: 'fake-price-id',
          amount: '$10.00'
        }
      }
    }))
    
  })
})