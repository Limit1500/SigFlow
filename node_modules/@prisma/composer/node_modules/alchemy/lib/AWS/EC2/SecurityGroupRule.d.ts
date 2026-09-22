import * as Provider from "../../Provider.ts";
import { Resource } from "../../Resource.ts";
import type { Providers } from "../Providers.ts";
import type { SecurityGroupId } from "./SecurityGroup.ts";
export type SecurityGroupRuleId<ID extends string = string> = `sgr-${ID}`;
export declare const SecurityGroupRuleId: <ID extends string>(id: ID) => ID & SecurityGroupRuleId<ID>;
export interface SecurityGroupRuleProps {
    /**
     * The ID of the security group.
     */
    groupId: SecurityGroupId;
    /**
     * Whether this is an ingress (inbound) or egress (outbound) rule.
     */
    type: "ingress" | "egress";
    /**
     * The IP protocol name or number.
     * Use -1 to specify all protocols.
     */
    ipProtocol: string;
    /**
     * The start of the port range.
     * For ICMP, use the ICMP type number.
     */
    fromPort?: number;
    /**
     * The end of the port range.
     * For ICMP, use the ICMP code.
     */
    toPort?: number;
    /**
     * IPv4 CIDR range to allow.
     */
    cidrIpv4?: string;
    /**
     * IPv6 CIDR range to allow.
     */
    cidrIpv6?: string;
    /**
     * ID of a security group to allow traffic from/to.
     */
    referencedGroupId?: SecurityGroupId;
    /**
     * ID of a prefix list.
     */
    prefixListId?: string;
    /**
     * Description for the rule.
     */
    description?: string;
    /**
     * Tags to assign to the security group rule.
     */
    tags?: Record<string, string>;
}
export interface SecurityGroupRule extends Resource<"AWS.EC2.SecurityGroupRule", SecurityGroupRuleProps, {
    /**
     * The ID of the security group rule.
     */
    securityGroupRuleId: SecurityGroupRuleId;
    /**
     * The ID of the security group.
     */
    groupId: SecurityGroupId;
    /**
     * The ID of the AWS account that owns the security group.
     */
    groupOwnerId: string;
    /**
     * Whether this is an egress rule.
     */
    isEgress: boolean;
    /**
     * The IP protocol.
     */
    ipProtocol: string;
    /**
     * The start of the port range.
     */
    fromPort?: number;
    /**
     * The end of the port range.
     */
    toPort?: number;
    /**
     * The IPv4 CIDR range.
     */
    cidrIpv4?: string | undefined;
    /**
     * The IPv6 CIDR range.
     */
    cidrIpv6?: string | undefined;
    /**
     * The ID of the referenced security group.
     */
    referencedGroupId?: string;
    /**
     * The ID of the prefix list.
     */
    prefixListId?: string;
    /**
     * The description.
     */
    description?: string | undefined;
}, never, Providers> {
}
/**
 * A single ingress or egress rule attached to an existing security group,
 * managed as a standalone resource. Use this when you want to manage a
 * security group's rules independently of the group itself — for example, to
 * add rules to a group owned by another stack, or to add rules without
 * triggering a full re-sync of the group's inline rule set.
 *
 * Most properties (protocol, ports, source, `type`) replace the rule when
 * changed; only `description` and `tags` are updated in place.
 *
 * ### Ingress vs Egress
 * The `type` field decides the direction: `"ingress"` for inbound rules and
 * `"egress"` for outbound. Everything else (protocol, ports, source) is shared
 * between the two directions.
 *
 * **Example:** Inbound HTTPS from anywhere
 * ```typescript
 * const httpsRule = yield* AWS.EC2.SecurityGroupRule("HttpsIngress", {
 *   groupId: sg.groupId,
 *   type: "ingress",
 *   ipProtocol: "tcp",
 *   fromPort: 443,
 *   toPort: 443,
 *   cidrIpv4: "0.0.0.0/0",
 *   description: "Allow HTTPS",
 * });
 * ```
 *
 * Opens TCP 443 inbound from the entire internet on the target group. A single
 * port is expressed by setting `fromPort` and `toPort` to the same value.
 *
 * **Example:** Outbound to a database port
 * ```typescript
 * const egressRule = yield* AWS.EC2.SecurityGroupRule("DbEgress", {
 *   groupId: sg.groupId,
 *   type: "egress",
 *   ipProtocol: "tcp",
 *   fromPort: 5432,
 *   toPort: 5432,
 *   cidrIpv4: "10.0.0.0/16",
 *   description: "Allow PostgreSQL to the VPC",
 * });
 * ```
 *
 * An egress rule restricts where the group's members may connect out to — here,
 * only PostgreSQL within the VPC CIDR. Adding any egress rule to a group
 * supersedes the default allow-all-outbound behavior.
 *
 * ### Rule Sources
 * A rule's source (for ingress) or destination (for egress) is exactly one of:
 * an IPv4 CIDR (`cidrIpv4`), an IPv6 CIDR (`cidrIpv6`), another security group
 * (`referencedGroupId`), or a managed prefix list (`prefixListId`).
 *
 * **Example:** Allow traffic from another security group
 * ```typescript
 * const dbFromWeb = yield* AWS.EC2.SecurityGroupRule("DbFromWeb", {
 *   groupId: dbSg.groupId,
 *   type: "ingress",
 *   ipProtocol: "tcp",
 *   fromPort: 5432,
 *   toPort: 5432,
 *   referencedGroupId: webSg.groupId,
 *   description: "Allow PostgreSQL from web tier",
 * });
 * ```
 *
 * Referencing `webSg` rather than a CIDR means any instance in the web tier can
 * reach the database, even as the tier's IPs change. This is the preferred way
 * to wire trust between tiers.
 *
 * **Example:** Allow an IPv6 range
 * ```typescript
 * const ipv6Rule = yield* AWS.EC2.SecurityGroupRule("HttpsIpv6", {
 *   groupId: sg.groupId,
 *   type: "ingress",
 *   ipProtocol: "tcp",
 *   fromPort: 443,
 *   toPort: 443,
 *   cidrIpv6: "::/0",
 *   description: "Allow HTTPS over IPv6",
 * });
 * ```
 *
 * Use `cidrIpv6` for dual-stack workloads; `::/0` is the IPv6 equivalent of
 * `0.0.0.0/0`. IPv4 and IPv6 are separate rules — you'd pair this with a
 * `cidrIpv4` rule to cover both.
 *
 * **Example:** Allow from a managed prefix list
 * ```typescript
 * const sshRule = yield* AWS.EC2.SecurityGroupRule("SshFromCorp", {
 *   groupId: sg.groupId,
 *   type: "ingress",
 *   ipProtocol: "tcp",
 *   fromPort: 22,
 *   toPort: 22,
 *   prefixListId: "pl-0123456789abcdef0",
 *   description: "Allow SSH from the corporate prefix list",
 * });
 * ```
 *
 * A `prefixListId` references a centrally-managed set of CIDRs by ID, so the
 * rule's effective ranges update automatically whenever the prefix list does.
 *
 * ### Protocols & Ports
 * `ipProtocol` accepts `tcp`, `udp`, `icmp`/`icmpv6`, a protocol number, or `-1`
 * for all protocols. For ICMP, `fromPort` is the ICMP type and `toPort` is the
 * ICMP code, with `-1` meaning "all".
 *
 * **Example:** Allow all traffic from a trusted CIDR
 * ```typescript
 * const allRule = yield* AWS.EC2.SecurityGroupRule("AllFromVpc", {
 *   groupId: sg.groupId,
 *   type: "ingress",
 *   ipProtocol: "-1",
 *   cidrIpv4: "10.0.0.0/16",
 *   description: "Allow all protocols from within the VPC",
 * });
 * ```
 *
 * With `ipProtocol: "-1"`, ports are ignored and every protocol is permitted —
 * appropriate only for fully trusted sources such as your own VPC CIDR.
 *
 * **Example:** Allow ICMP echo (ping)
 * ```typescript
 * const icmpRule = yield* AWS.EC2.SecurityGroupRule("AllowPing", {
 *   groupId: sg.groupId,
 *   type: "ingress",
 *   ipProtocol: "icmp",
 *   fromPort: 8,
 *   toPort: 0,
 *   cidrIpv4: "10.0.0.0/16",
 *   description: "Allow ICMP echo request",
 * });
 * ```
 *
 * For ICMP the port fields carry the type and code: type `8` / code `0` is an
 * echo request (ping). Use `fromPort: -1, toPort: -1` to allow every ICMP
 * type/code instead.
 *
 * @resource
 */
export declare const SecurityGroupRule: import("../../Resource.ts").ResourceClass<SecurityGroupRule>;
export declare const SecurityGroupRuleProvider: () => import("effect/Layer").Layer<Provider.Provider<SecurityGroupRule>, never, import("@distilled.cloud/aws/Credentials").Credentials | import("effect/unstable/http/HttpClient").HttpClient | import("../../Stack.ts").Stack | import("../../Stage.ts").Stage>;
//# sourceMappingURL=SecurityGroupRule.d.ts.map