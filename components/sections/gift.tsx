import Image from "next/image";
import { CopyButton } from "@/components/client/copy-button";
import { Section } from "@/components/section";
import { wedding } from "@/content/wedding";

export function Gift() {
  const { text, qris, accounts } = wedding.gift;

  return (
    <Section id="hadiah" className="px-142 pt-204">
      <h2 className="reveal text-h1 font-bold text-rose">Wedding Gift</h2>
      <p className="reveal mt-32 text-lead text-ink">{text}</p>

      <div className="reveal relative mt-72 h-552 w-542 overflow-hidden rounded-card bg-white shadow-md">
        <Image
          src={qris}
          alt="Kode QRIS untuk wedding gift"
          fill
          sizes="(max-width: 480px) 50vw, 241px"
          className="object-contain"
        />
      </div>

      <ul className="mt-150 flex w-full flex-col gap-40 pl-37">
        {accounts.map((account) => (
          <li key={account.bank} className="reveal flex items-center gap-48 text-left">
            <div className="relative h-128 w-400 shrink-0 overflow-hidden rounded-card bg-white shadow-sm">
              <Image
                src={account.logo}
                alt={`Logo ${account.bank}`}
                fill
                sizes="(max-width: 480px) 37vw, 178px"
                className="object-contain p-12"
              />
            </div>
            <div className="min-w-0">
              <p className="text-body text-ink">{account.holder}</p>
              <p className="mt-8 flex items-center gap-4 text-lead font-bold tracking-[0.05em] text-ink">
                {account.number}
                <CopyButton value={account.number} label={`nomor rekening ${account.bank}`} />
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
