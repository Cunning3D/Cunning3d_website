import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import type { MeLocale, MePageConfig } from '@/config/me';

const FONT_FAMILY = 'NotoSansSC';

// Ensure Chinese text renders correctly in the generated PDF.
// Using Google Fonts static TTF endpoints keeps the serverless bundle small.
Font.register({
  family: FONT_FAMILY,
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosanssc/v40/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnYw.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/notosanssc/v40/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaGzjCnYw.ttf',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 44,
    paddingHorizontal: 42,
    fontFamily: FONT_FAMILY,
    fontSize: 11,
    color: '#0f172a',
    lineHeight: 1.45,
  },
  header: {
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerRow: {
    flexDirection: 'row',
    gap: 18,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  name: { fontSize: 24, fontWeight: 700, letterSpacing: -0.2 },
  title: { marginTop: 4, fontSize: 11.5, color: '#475569' },
  metaCol: { alignItems: 'flex-end', gap: 2 },
  meta: { fontSize: 10, color: '#475569' },
  linksRow: { flexDirection: 'row', gap: 10, marginTop: 10, flexWrap: 'wrap' },
  link: { fontSize: 10, color: '#2563eb', textDecoration: 'none' },

  section: { marginTop: 14 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#0f172a',
    marginBottom: 8,
  },
  paragraph: { color: '#334155' },

  highlightsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  highlightCard: {
    flexGrow: 1,
    flexBasis: 160,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  highlightLabel: { fontSize: 9.5, color: '#64748b' },
  highlightValue: { marginTop: 3, fontSize: 14.5, fontWeight: 700, color: '#0f172a' },
  highlightDetail: { marginTop: 3, fontSize: 9.5, color: '#475569' },

  item: { paddingBottom: 12, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eef2f7' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  itemTitle: { fontSize: 11.5, fontWeight: 700, color: '#0f172a' },
  itemSubTitle: { marginTop: 2, fontSize: 10, color: '#475569' },
  itemTime: { fontSize: 10, color: '#475569' },
  itemSummary: { marginTop: 6, fontSize: 10.5, color: '#334155' },

  bullets: { marginTop: 6, gap: 3 },
  bulletRow: { flexDirection: 'row', gap: 8 },
  bulletDot: { width: 10, color: '#0f172a' },
  bulletText: { flex: 1, fontSize: 10.5, color: '#334155' },

  tagsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 8 },
  tag: {
    fontSize: 9,
    color: '#334155',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 8,
    backgroundColor: '#f8fafc',
  },

  skillsGroup: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  skillsGroupTitle: { fontSize: 10.5, fontWeight: 700, marginBottom: 6, color: '#0f172a' },
  skillsList: { fontSize: 10.5, color: '#334155' },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Tags({ tags }: { tags: string[] | undefined }) {
  if (!tags?.length) return null;
  return (
    <View style={styles.tagsRow}>
      {tags.map((tag) => (
        <Text key={tag} style={styles.tag}>
          {tag}
        </Text>
      ))}
    </View>
  );
}

function BulletList({ items }: { items: string[] | undefined }) {
  if (!items?.length) return null;
  return (
    <View style={styles.bullets}>
      {items.map((b, idx) => (
        <View key={idx} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{b}</Text>
        </View>
      ))}
    </View>
  );
}

export function createResumePdfDocument({
  config,
  locale,
}: {
  config: MePageConfig;
  locale: MeLocale;
}) {
  const { profile } = config;

  const socialLinks: Array<{ label: string; href: string }> = [];
  if (profile.social?.website) socialLinks.push({ label: 'Website', href: profile.social.website });
  if (profile.social?.github) socialLinks.push({ label: 'GitHub', href: profile.social.github });
  if (profile.social?.linkedin) socialLinks.push({ label: 'LinkedIn', href: profile.social.linkedin });
  if (profile.social?.twitter) socialLinks.push({ label: 'Twitter', href: profile.social.twitter });

  return (
    <Document title={`${profile.name} - Resume`} author={profile.name}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.title}>{profile.title}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.meta}>{profile.location}</Text>
              <Text style={styles.meta}>{profile.email}</Text>
            </View>
          </View>

          {socialLinks.length ? (
            <View style={styles.linksRow}>
              {socialLinks.map((l) => (
                <Link key={l.href} src={l.href} style={styles.link}>
                  {l.label}
                </Link>
              ))}
            </View>
          ) : null}
        </View>

        <Section title={config.meta.title}>
          <Text style={styles.paragraph}>{profile.bio}</Text>
        </Section>

        {config.highlights.items?.length ? (
          <Section title={config.highlights.title}>
            <View style={styles.highlightsGrid}>
              {config.highlights.items.map((h) => (
                <View key={`${h.label}-${h.value}`} style={styles.highlightCard}>
                  <Text style={styles.highlightLabel}>{h.label}</Text>
                  <Text style={styles.highlightValue}>{h.value}</Text>
                  {h.detail ? <Text style={styles.highlightDetail}>{h.detail}</Text> : null}
                </View>
              ))}
            </View>
          </Section>
        ) : null}

        {config.experience.items?.length ? (
          <Section title={config.experience.title}>
            {config.experience.items.map((item) => (
              <View key={`${item.company}-${item.role}-${item.start}`} style={styles.item}>
                <View style={styles.itemHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{item.role}</Text>
                    <Text style={styles.itemSubTitle}>
                      {item.company}
                      {item.location ? ` · ${item.location}` : ''}
                    </Text>
                  </View>
                  <Text style={styles.itemTime}>
                    {item.start} – {item.end}
                  </Text>
                </View>
                {item.summary ? <Text style={styles.itemSummary}>{item.summary}</Text> : null}
                <BulletList items={item.bullets} />
                <Tags tags={item.tags} />
              </View>
            ))}
          </Section>
        ) : null}

        {config.projects.items?.length ? (
          <Section title={config.projects.title}>
            {config.projects.items.map((project) => (
              <View key={project.name} style={styles.item}>
                <View style={styles.itemHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{project.name}</Text>
                    <Text style={styles.itemSummary}>{project.description}</Text>
                  </View>
                </View>
                <BulletList items={project.highlights} />
                <Tags tags={project.tags} />
                {project.links?.length ? (
                  <View style={styles.linksRow}>
                    {project.links.map((l) => (
                      <Link key={l.href} src={l.href} style={styles.link}>
                        {l.label}
                      </Link>
                    ))}
                  </View>
                ) : null}
              </View>
            ))}
          </Section>
        ) : null}

        {config.skills.groups?.length ? (
          <Section title={config.skills.title}>
            <View style={styles.highlightsGrid}>
              {config.skills.groups.map((g) => (
                <View key={g.name} style={styles.skillsGroup}>
                  <Text style={styles.skillsGroupTitle}>{g.name}</Text>
                  <Text style={styles.skillsList}>{g.items.join(' · ')}</Text>
                </View>
              ))}
            </View>
          </Section>
        ) : null}

        {config.education.items?.length ? (
          <Section title={config.education.title}>
            {config.education.items.map((e) => (
              <View key={`${e.school}-${e.degree}`} style={styles.item}>
                <View style={styles.itemHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{e.school}</Text>
                    <Text style={styles.itemSubTitle}>{e.degree}</Text>
                  </View>
                  <Text style={styles.itemTime}>
                    {(e.start ?? '') + (e.start && e.end ? ' – ' : '') + (e.end ?? '')}
                  </Text>
                </View>
                {e.detail ? <Text style={styles.itemSummary}>{e.detail}</Text> : null}
              </View>
            ))}
          </Section>
        ) : null}

        <Section title={config.contact.title}>
          <Text style={styles.paragraph}>{profile.email}</Text>
        </Section>
      </Page>
    </Document>
  );
}
