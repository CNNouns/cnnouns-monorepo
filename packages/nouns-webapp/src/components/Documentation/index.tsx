import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Link from '../Link';
import { Trans } from '@lingui/macro';
import { NoTrans } from '../../i18n/NoTrans';

interface DocumentationProps {
  backgroundColor?: string;
}

const Documentation = (props: DocumentationProps = { backgroundColor: '#FFF' }) => {
  const publicDomainLink = (
    <Link
      text={<Trans>public domain</Trans>}
      url="https://creativecommons.org/publicdomain/zero/1.0/"
      leavesPage={true}
    />
  );
  const nounsGovLink = (
    <Link
      text={<Trans>Nouns DAO</Trans>}
      url="https://nouns.wtf/vote"
      leavesPage={true}
    />
  );
  const ninjaDaoLnk = (
    <Link
      text={<NoTrans>https://discord.gg/ninjadao</NoTrans>}
       url="https://discord.gg/ninjadao"
      leavesPage={true}
    />
  );
  return (
    <Section fullWidth={false} style={{ background: props.backgroundColor, padding: '4rem 0' }}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>
            <NoTrans>これはなに?</NoTrans>
          </h1>
          <p className={classes.aboutText}>
            <NoTrans>
              搾取の時代に、さよならを
            </NoTrans>
          </p>
          <p className={classes.aboutText}>
            <NoTrans>
              CryptoNinja Nouns（以下、CN Nouns） は、クリエイターエコノミーのためのトレジャリー（共同財源）を形成するための実験的な試みです
            </NoTrans>
          </p>
          <p className={classes.aboutText}>
            <NoTrans>
              CN Nounsの目的は、クリエイター主導の経済を加速させることです
            </NoTrans>
          </p>
          <p className={classes.aboutText} style={{ paddingBottom: '4rem' }}>
            <NoTrans>
              トレジャリーは上記の目的のために使われます。資金使途はCN Nounsオーナーたち（Ninjarz）の投票によって決定します。本プロジェクトのスマートコントラクトは、Nounsをフォークし、改善したものです
            </NoTrans>
          </p>
        </div>
        <Accordion flush>
          <Accordion.Item eventKey="0" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Summary</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>
                  <NoTrans>
                    CN Nounsのアートワークは{publicDomainLink}です
                  </NoTrans>
                </li>
                <li>
                  <NoTrans>
                    1つのCN Nounが最初24時間ごとにオークションにかけられ、永遠に続きます。オークションの受付時間は1日毎に時間が長くなり、4年間毎に一定時間まで倍増していきます
                  </NoTrans>
                </li>
                <li>
                  <NoTrans>
                    CN Nounsオークションに集まるETHは、第三者の介入無しで100%自動的にスマートコントラクトで制御されたトレジャリーに送られます
                  </NoTrans>
                </li>
                <li>
                  <NoTrans>
                    オークションが確定し「トランザクションを動かす」と、次のオークションが始まります
                  </NoTrans>
                </li>
                <li>
                  <NoTrans>
                    すべてのCN Nounsオーナーたち（Ninjarz）は、CN Nouns DAOのメンバーです
                  </NoTrans>
                </li>
                <li>
                  <NoTrans>
                    CN Nouns DAOは「{nounsGovLink}」のフォークを使用しています
                  </NoTrans>
                </li>
                <li>
                  <NoTrans>
                    1つのCN Nounには、1票の投票権限があります
                  </NoTrans>
                </li>
                <li>
                  <NoTrans>
                    トレジャリーは投票を通じてCN Nouns DAOのメンバーによって管理されます
                  </NoTrans>
                </li>
                <li>
                  <NoTrans>
                    アートワークは自動的にフルオンチェーンで生成されており、直接オンチェーンに保存されます（IPFSではありません）
                  </NoTrans>
                </li>
                <li>
                  <NoTrans>
                    レアリティについての明確なルールは存在しません。すべてのCN Nounはそれぞれが「レア」です
                  </NoTrans>
                </li>
                <li>
                  <NoTrans>
                    DAO投票をより円滑にするため、投票にかかったガス代返還の仕組みを備えています。投票の際に掛かったGAS代の一定額が返還されます。この費用はトレジャリーを介して捻出されます
                  </NoTrans>
                </li>
                <li>
                  <NoTrans>
                    CN Nounsの立ち上げをサポートした初期メンバーは、10日に1つのCN Nounの報酬を受け取ります（最初の5年間にわたって、供給量の10％が配布されます）
                  </NoTrans>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <NoTrans>CN Nounsの特徴</NoTrans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <NoTrans>
                  CN Nounsは、イーサリアムのブロックハッシュに基づいてランダムに生成されます。CN Nounの特徴の希少性を管理する「if」ステートメントやその他のルールは存在しないため、すべてのCN Nounが等しく希少となります。現時点では、CN Nounsは以下のもので構成されています：
                </NoTrans>
              </p>
              <ul>
                <li>
                  <NoTrans>背景（2）</NoTrans>
                </li>
                <li>
                  <NoTrans>体（58）</NoTrans>
                </li>
                <li>
                  <NoTrans>頭（75）</NoTrans>
                </li>
                <li>
                  <NoTrans>メガネ（50）</NoTrans>
                </li>
                <li>
                  <NoTrans>スキル（125）</NoTrans>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <NoTrans>DAOのやりとり</NoTrans>
            </Accordion.Header>
            <Accordion.Body>
              <p className={classes.aboutText}>
                <NoTrans>
                  CN Nouns DAOは下記のDiscordサーバー内の「cnn-cryptoninja-nounsプロジェクト」にて、やりとりを行っています
                </NoTrans>
                <br/>
                {ninjaDaoLnk}
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <NoTrans>初期メンバーへの報酬</NoTrans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <NoTrans>
                  初期メンバーとはCN Nounsの立ち上げをサポートした人たちで、以下のメンバーで構成されています
                </NoTrans>
              </p>
              <ul style={{marginBottom: '0.5rem'}}>
                <li>
                  <Link text="paji.eth" url="https://twitter.com/paji_a" leavesPage={true} />
                </li>
                <li>
                  <Link text="madorominn" url="https://twitter.com/madorominn" leavesPage={true} />
                </li>
                <li>
                  <Link text="hanatochill" url="https://twitter.com/hanatochill" leavesPage={true} />
                </li>
                <li>
                  <Link text="KNG_massu" url="https://twitter.com/KNG_massu" leavesPage={true} />
                </li>
                <li>
                  <Link text="Ikehaya-nft.eth" url="https://twitter.com/ihayato" leavesPage={true} />
                </li>
                <li>
                  <Link text="m2dxnft" url="https://twitter.com/m2dxnft" leavesPage={true} />
                </li>
                <li>
                  <Link text="munakata_souri" url="https://twitter.com/munakata_souri" leavesPage={true} />
                </li>
              </ul>
              <div>
                <NoTrans>（順不同）</NoTrans>
              </div>
              <p>
                <NoTrans>
                  CN Nounsオークションに集まるETHは、第三者の介入無しで100%自動的にスマートコントラクトで制御されたトレジャリーに送られます。代わりに、CN Nounsの立ち上げをサポートした初期メンバーは、10日に1つのCN Nounの報酬を受け取ります（最初の5年間にわたって、供給量の10％が配布されます）
                </NoTrans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </Section>
  );
};
export default Documentation;
