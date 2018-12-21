import { constants } from "@arkecosystem/crypto";
import Boom from "boom";
import { transactionsRepository } from "../../../repositories";
import { generateCacheKey, getCacheTimeout } from "../../utils";
import { paginate, respondWithResource, toPagination } from "../utils";

const { TransactionTypes } = constants;

const index = async request => {
    const transactions = await transactionsRepository.findAllByType(TransactionTypes.Vote, {
        ...request.query,
        ...paginate(request),
    });

    return toPagination(request, transactions, "transaction");
};

const show = async request => {
    const transaction = await transactionsRepository.findByTypeAndId(TransactionTypes.Vote, request.params.id);

    if (!transaction) {
        return Boom.notFound("Vote not found");
    }

    return respondWithResource(request, transaction, "transaction");
};

export function registerMethods(server) {
    const cacheDisabled = !server.app.config.cache.enabled;

    server.method(
        "v2.votes.index",
        index,
        cacheDisabled
            ? {}
            : {
                  cache: {
                      expiresIn: 8 * 1000,
                      generateTimeout: getCacheTimeout(),
                      getDecoratedValue: true,
                  },
                  generateKey: request =>
                      generateCacheKey({
                          ...request.query,
                          ...paginate(request),
                      }),
              },
    );

    server.method(
        "v2.votes.show",
        show,
        cacheDisabled
            ? {}
            : {
                  cache: {
                      expiresIn: 8 * 1000,
                      generateTimeout: getCacheTimeout(),
                      getDecoratedValue: true,
                  },
                  generateKey: request => generateCacheKey({ id: request.params.id }),
              },
    );
}
