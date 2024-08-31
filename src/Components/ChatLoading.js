


import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

function ChatLoading() {
    return (
        <Stack>
            <Skeleton height='60px' />
            <Skeleton height='60px' />
            <Skeleton height='60px' />
            <Skeleton height='60px' />
            <Skeleton height='60px' />
            <Skeleton height='60px' />
            <Skeleton height='60px' />
            <Skeleton height='60px' />

        </Stack>
    )
}

export default ChatLoading