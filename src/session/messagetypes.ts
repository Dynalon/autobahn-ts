/**
 * Define type aliases to match the WAMP IETF draft wording convention.
 */
type Id = number;
type Uri = string;
type MsgId = number;

/**
 * Dict type is required to use string keys as defined in the IETF draft.
 *
 * @see https://tools.ietf.org/html/draft-oberstet-hybi-tavendo-wamp-02#section-6.1
 */
type Dict = any;

export type WELCOME = [
    MsgId,
    Id,
    any
];

export type ABORT = [
    MsgId,
    Dict,
    Uri
];

export type GOODBYE = [
    MsgId,
    Dict,
    Uri
];

export type CHALLENGE = [
    MsgId,
    string,
    Dict
]

/**
 * [SUBSCRIBED, SUBSCRIBE.Request | id, Subscription | id]
 */
export type SUBSCRIBED = [
    MsgId,
    Id,
    Id
];

/**
 * [ERROR, SUBSCRIBE, SUBSCRIBE.Request|id, Details|dict, Error|uri]
 *
 * UNSPECIFIED SPECVIOLATION: AutobahnJS contains additional fields "args, kwargs"
 * which are not in the SPEC 02
 */
export type SUBSCRIBE_ERROR = [
    MsgId,
    Id,
    Id,
    Dict,
    Uri,
    // UNSPECIFIED SPECVIOLATION
    Array<any>, // "args"
    Dict // "kwargs"
];

/**
 * [UNSUBSCRIBED, UNSUBSCRIBE.Request|id]
 */
export type UNSUBSCRIBED = [
    MsgId,
    Id,
    // UNSPECIFIED SPECVIOLATION
    Dict // details
];

export type UNSUBSCRIBE_ERROR = [
    MsgId,
    Id,
    Id,
    Dict,
    Uri,
    // UNSPECIFIED SPECVIOLATION
    Array<any>, // "args"
    Dict // "kwargs"
];

export type PUBLISHED = [
    MsgId,
    Id,
    Id
];

export type PUBLISH_ERROR = [
    MsgId,
    Id,
    Id,
    Dict,
    Uri,
    // UNSPECIFIED SPECVIOLATION
    Array<any>, // "args"
    Dict // "kwargs"
];

/**
 * [EVENT, SUBSCRIBED.Subscription|id, PUBLISHED.Publication|id, Details|dict, PUBLISH.Arguments|list, PUBLISH.ArgumentsKw|dict]
 */
export type EVENT = [
    MsgId,
    Id,
    Id,
    Dict,
    Array<any>,
    Dict
];

/**
 *  [REGISTERED, REGISTER.Request|id, Registration|id]
 */
export type REGISTERED = [
    MsgId,
    Id,
    Id
];

export type REGISTER_ERROR = [
    MsgId,
    Id,
    Id,
    Dict,
    Uri,
    // UNSPECIFIED SPECVIOLATION
    Array<any>, // "args"
    Dict // "kwargs"
];

export type UNREGISTERED = [
    MsgId,
    Id,
    Dict,
    Uri
];

export type UNREGISTER_ERROR = [
    MsgId,
    MsgId,
    Id,
    Dict,
    Uri,
    // UNSPECIFIED SPECVIOLATION
    Array<any>, // "args"
    Dict // "kwargs"
];

export type RESULT = [
    MsgId,
    Id,
    Dict,
    // UNSPECIFIED SPECVIOLATION
    Array<any>, // "args"
    Dict // "kwargs"
];

export type CALL_ERROR = [
    MsgId,
    Id,
    Id,
    Dict,
    Uri,
    // UNSPECIFIED SPECVIOLATION
    Array<any>, // "args"
    Dict // "kwargs"
];

export type INVOCATION = [
    MsgId,
    Id,
    Id,
    Dict,
    // UNSPECIFIED SPECVIOLATION
    Array<any>, // "args"
    Dict // "kwargs"
];
