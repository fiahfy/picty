import React from 'react'
import Link from 'next/link'

import { User } from '../interfaces'

type Props = {
  data: User
}

const ListItem = ({ data }: Props) => (
  <Link as={`/detail/${data.id}`} href="/detail/[id]">
    <a>
      {data.id}: {data.name}
    </a>
  </Link>
)

export default ListItem
