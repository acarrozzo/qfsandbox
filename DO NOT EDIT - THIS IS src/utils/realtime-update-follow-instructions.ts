import { z } from 'zod'

import { logger } from '@mntn-dev/logger'
import type { AnyValue, ZodInfer } from '@mntn-dev/utility-types'

const InvalidateInstructionSchema = z.strictObject({
  invalidate: z.array(z.any()),
})
const RefetchInstructionSchema = z.strictObject({ refetch: z.array(z.any()) })
type InvalidateInstruction = ZodInfer<typeof InvalidateInstructionSchema>
type RefetchInstruction = ZodInfer<typeof RefetchInstructionSchema>
type ArrayInstruction = InvalidateInstruction | RefetchInstruction

const isInvalidateInstruction = (
  instruction: AnyValue
): instruction is InvalidateInstruction => {
  return InvalidateInstructionSchema.safeParse(instruction).success
}

const isRefetchInstruction = (
  instruction: AnyValue
): instruction is RefetchInstruction => {
  return RefetchInstructionSchema.safeParse(instruction).success
}

const isArrayInstruction = (
  instruction: AnyValue
): instruction is ArrayInstruction => {
  return (
    isInvalidateInstruction(instruction) || isRefetchInstruction(instruction)
  )
}

const getArrayInstructionMethod = (instruction: ArrayInstruction) => {
  return Object.keys(instruction)[0] as 'invalidate' | 'refetch'
}

async function handleArrayInstruction(
  subRouter: AnyValue,
  instructions: ArrayInstruction
) {
  const method = getArrayInstructionMethod(instructions)
  const arrayInstructions = (instructions as AnyValue)[method]
  if (arrayInstructions.length > 0) {
    for (const instruction of arrayInstructions) {
      await subRouter[method](instruction)
    }
  } else {
    await subRouter[method]()
  }
}

async function handleSimpleInstruction(
  subRouter: AnyValue,
  instruction: 'invalidate' | 'refetch'
) {
  await subRouter[instruction]()
}

async function processInstructions(
  subRouter: AnyValue,
  subInstructions: AnyValue
) {
  if (isArrayInstruction(subInstructions)) {
    await handleArrayInstruction(subRouter, subInstructions)
  } else if (
    subInstructions === 'invalidate' ||
    subInstructions === 'refetch'
  ) {
    await handleSimpleInstruction(subRouter, subInstructions)
  } else if (typeof subInstructions === 'object') {
    await followInstructions(subRouter, subInstructions)
  } else if (typeof subInstructions === 'string') {
    logger.error('Invalid realtime update instructions. Handling as refetch.', {
      subInstructions,
    })
    await subRouter.refetch(subInstructions)
  } else {
    throw new Error('Invalid instructions')
  }
}

export async function followInstructions(
  router: AnyValue,
  instructions: AnyValue
): Promise<void> {
  for (const key in instructions) {
    const subRouter = router[key]
    const subInstructions = instructions[key]

    if (!(subRouter && subInstructions)) {
      logger.error('Invalid realtime update instructions. Ignoring.', {
        instructions,
      })
      return
    }

    await processInstructions(subRouter, subInstructions)
  }
}
