import { GraphQLError } from '../../error/GraphQLError.ts';
import type { ASTVisitor } from '../../language/visitor.ts';
import type { ASTValidationContext } from '../ValidationContext.ts';
/**
 * Unique argument names
 *
 * A GraphQL field or directive is only valid if all supplied arguments are
 * uniquely named.
 *
 * See https://spec.graphql.org/draft/#sec-Argument-Names
 */

export function UniqueArgumentNamesRule(
  context: ASTValidationContext,
): ASTVisitor {
  let knownArgNames = Object.create(null);
  return {
    Field() {
      knownArgNames = Object.create(null);
    },

    Directive() {
      knownArgNames = Object.create(null);
    },

    Argument(node) {
      const argName = node.name.value;

      if (knownArgNames[argName]) {
        context.reportError(
          new GraphQLError(
            `There can be only one argument named "${argName}".`,
            [knownArgNames[argName], node.name],
          ),
        );
      } else {
        knownArgNames[argName] = node.name;
      }

      return false;
    },
  };
}