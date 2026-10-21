import { readHangul } from "@/lib/hangul";
import styles from "./receipt.module.css";

// 읽는 법: [ㄱ] g [ㅏ] a =가 (SPEC §4). 칸이 넘치면 음절 단위로 줄을 바꾼다
export function JamoTiles({ hangul }: { hangul: string }) {
  return (
    <div className={styles.jamoRow} lang="ko">
      {readHangul(hangul).map(({ syllable, jamo }, index) => (
        <div key={`${syllable}-${index}`} className={styles.jamoGroup}>
          {jamo.map(({ letter, roman }, i) => (
            <span key={i} className={styles.jamoPair}>
              <span className={styles.jamoTile}>{letter}</span>
              {roman}
            </span>
          ))}
          <span className={styles.jamoEquals}>={syllable}</span>
        </div>
      ))}
    </div>
  );
}
