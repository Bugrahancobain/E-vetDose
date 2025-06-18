import medications from '../../../../../data/medicationsDetailsData.json';
import styles from './DrugsDetails.module.css';

export default function MedicationDetails({ params }) {
    const med = medications.find((m) => m.id === params.id);

    if (!med) return <div>İlaç bulunamadı.</div>;

    const formatKey = (key) => key.replace(/_/g, ' ').toUpperCase();

    const renderValue = (value) => {
        const renderValue = (value) => {
            if (typeof value === 'string') return <p>{value}</p>;

            if (Array.isArray(value)) {
                return (
                    <ul className={styles.list}>
                        {value.map((item, i) =>
                            typeof item === 'object' ? (
                                <li key={i} className={styles.listItem}>
                                    {Object.entries(item).map(([k, v]) => (
                                        <p key={k}><b>{formatKey(k)}:</b> {v}</p>
                                    ))}
                                </li>
                            ) : (
                                <li key={i} className={styles.listItem}>• {item}</li>
                            )
                        )}
                    </ul>
                );
            }

            if (typeof value === 'object') {
                return Object.entries(value).map(([k, v]) => (
                    <div key={k}>
                        <h4>{formatKey(k)}</h4>
                        {renderValue(v)}
                    </div>
                ));
            }

            return null;
        };
        if (typeof value === 'string') return <p>{value}</p>;
        if (Array.isArray(value)) {
            return (
                <ul>
                    {value.map((item, i) =>
                        typeof item === 'object' ? (
                            <li key={i}>
                                {Object.entries(item).map(([k, v]) => (
                                    <p key={k}><b>{formatKey(k)}:</b> {v}</p>
                                ))}
                            </li>
                        ) : (
                            <li key={i}>• {item}</li>
                        )
                    )}
                </ul>
            );
        }
        if (typeof value === 'object') {
            return Object.entries(value).map(([k, v]) => (
                <div key={k}>
                    <h4>{formatKey(k)}</h4>
                    {renderValue(v)}
                </div>
            ));
        }
        return null;
    };

    return (
        <div className={styles.detailContainer}>
            <h1 className={styles.title}>{med.name}</h1>
            {Object.entries(med.details).map(([key, value]) => (
                <div key={key} className={styles.section}>
                    <h2>{formatKey(key)}</h2>
                    {renderValue(value)}
                </div>
            ))}
        </div>
    );
}